using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using leisure_center_bookings.Dtos;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace leisure_center_bookings.Services
{
    public interface ILeisureCenterService
    {
        Task<User> GetLeisureCenterUser();
        Task<List<Class>> GetClasses();
        Task<Class> GetClass(string id);
        Task<Class> AddToClass(string id);
        Task<Class> RemoveFromClass(string id);
        Task<Class> AddToWaitlist(string id);
        Task<Class> RemoveFromWaitlist(string id);
        Task<List<Class>> GetSchedule();
    }

    public class LeisureCenterService : ILeisureCenterService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly LeisureCenterConfiguration _leisureCenterConfiguration;

        public LeisureCenterService(IHttpClientFactory httpClientFactory, IMemoryCache memoryCache,
            IOptions<LeisureCenterConfiguration> leisureCenterConfiguration)
        {
            _httpClient = httpClientFactory.CreateClient("leisureCenterClient");
            _cache = memoryCache;
            _leisureCenterConfiguration = leisureCenterConfiguration.Value;
        }

        public async Task<User> GetLeisureCenterUser()
        {
            if (_cache.TryGetValue("leisureCenterUser", out User leisureCenterUser))
            {
                return leisureCenterUser;
            }

            return await Login();
        }

        private async Task<User> Login()
        {
            var dict = new Dictionary<string, string>();
            
            Console.WriteLine(_leisureCenterConfiguration.Username);
            
            dict.Add("username", _leisureCenterConfiguration.Username);
            dict.Add("password", _leisureCenterConfiguration.Password);

            var req = new HttpRequestMessage
            {
                RequestUri = new Uri("https://parkwoodleisure.netpulse.com/np/exerciser/login"),
                Method = HttpMethod.Post,
                Headers = {{"test", "test"}},
                Content = new FormUrlEncodedContent(dict)
            };

            var res = await _httpClient.SendAsync(req);

            var user = JsonConvert.DeserializeObject<User>(await res.Content.ReadAsStringAsync());

            if (user == null)
            {
                return null;
            }

            var cookies = res.Headers.SingleOrDefault(header => header.Key == "Set-Cookie").Value;
            var cookie = new Dictionary<string, string>();
            foreach (var cookieString in cookies)
            {
                foreach (var cookiePart in cookieString.Split(";"))
                {
                    var cookieKeyValue = cookiePart.Split("=");
                    if (cookieKeyValue.Length == 2)
                    {
                        cookie.Add(cookieKeyValue[0].Trim(), cookieKeyValue[1].Trim());
                    }
                }
            }

            var expiration = cookie["Expires"];
            var matcher = "ddd, d MMM yyyy HH:mm:ss \"" + expiration.Substring(expiration.Length - 3) + "\"";
            var date = DateTime.ParseExact(expiration, matcher, CultureInfo.InvariantCulture);

            user.AuthenticationCookieHeaderValue = $"JSESSIONID={cookie["JSESSIONID"]}";

            var cacheEntryOptions = new MemoryCacheEntryOptions().SetAbsoluteExpiration(date);
            _cache.Set("leisureCenterUser", user, cacheEntryOptions);
            return user;
        }

        public async Task<List<Class>> GetClasses()
        {
            var user = await GetLeisureCenterUser();
            var req = new HttpRequestMessage
            {
                RequestUri =
                    new Uri(
                        $"https://parkwoodleisure.netpulse.com/np/company/{user.HomeClubUuid}/classes?exerciserUuid={user.Uuid}"),
                Method = HttpMethod.Get
            };

            req.Headers.Add("Cookie", user.AuthenticationCookieHeaderValue);

            var res = await _httpClient.SendAsync(req);

            var data = await res.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<List<Class>>(data)!.ToList();
            ;
        }

        public async Task<Class> GetClass(string id)
        {
            var user = await GetLeisureCenterUser();
            var req = new HttpRequestMessage
            {
                RequestUri = new Uri($"https://parkwoodleisure.netpulse.com/np/company/{user.HomeClubUuid}/class/{id}"),
                Method = HttpMethod.Get
            };

            req.Headers.Add("Cookie", user.AuthenticationCookieHeaderValue);

            var res = await _httpClient.SendAsync(req);

            return JsonConvert.DeserializeObject<Class>(await res.Content.ReadAsStringAsync());
        }

        public async Task<Class> AddToClass(string id)
        {
            var user = await GetLeisureCenterUser();

            var content = new Dictionary<string, string>();
            content.Add("exerciserUuid", user.Uuid);

            var req = new HttpRequestMessage
            {
                RequestUri =
                    new Uri(
                        $"https://parkwoodleisure.netpulse.com/np/company/{user.HomeClubUuid}/class/{id}/addExerciser"),
                Method = HttpMethod.Post,
                Content = new FormUrlEncodedContent(content)
            };

            req.Headers.Add("Cookie", user.AuthenticationCookieHeaderValue);

            var res = await _httpClient.SendAsync(req);

            if (!res.IsSuccessStatusCode)
            {
                throw new Exception();
            }

            return JsonConvert.DeserializeObject<Class>(await res.Content.ReadAsStringAsync());
        }

        public async Task<Class> RemoveFromClass(string id)
        {
            var user = await GetLeisureCenterUser();

            var content = new Dictionary<string, string>();
            content.Add("exerciserUuid", user.Uuid);

            var req = new HttpRequestMessage
            {
                RequestUri =
                    new Uri(
                        $"https://parkwoodleisure.netpulse.com/np/company/{user.HomeClubUuid}/class/{id}/removeExerciser"),
                Method = HttpMethod.Post,
                Content = new FormUrlEncodedContent(content)
            };

            req.Headers.Add("Cookie", user.AuthenticationCookieHeaderValue);

            var res = await _httpClient.SendAsync(req);

            return JsonConvert.DeserializeObject<Class>(await res.Content.ReadAsStringAsync());
        }

        public async Task<Class> AddToWaitlist(string id)
        {
            var user = await GetLeisureCenterUser();

            var content = new Dictionary<string, string>();
            content.Add("exerciserUuid", user.Uuid);

            var req = new HttpRequestMessage
            {
                RequestUri =
                    new Uri(
                        $"https://parkwoodleisure.netpulse.com/np/company/{user.HomeClubUuid}/class/{id}/waitlist/addExerciser"),
                Method = HttpMethod.Post,
                Content = new FormUrlEncodedContent(content)
            };

            req.Headers.Add("Cookie", user.AuthenticationCookieHeaderValue);

            var res = await _httpClient.SendAsync(req);

            return JsonConvert.DeserializeObject<Class>(await res.Content.ReadAsStringAsync());
        }

        public async Task<Class> RemoveFromWaitlist(string id)
        {
            var user = await GetLeisureCenterUser();

            var content = new Dictionary<string, string>();
            content.Add("exerciserUuid", user.Uuid);

            var req = new HttpRequestMessage
            {
                RequestUri =
                    new Uri(
                        $"https://parkwoodleisure.netpulse.com/np/company/{user.HomeClubUuid}/class/{id}/waitlist/removeExerciser"),
                Method = HttpMethod.Post,
                Content = new FormUrlEncodedContent(content)
            };

            req.Headers.Add("Cookie", user.AuthenticationCookieHeaderValue);

            var res = await _httpClient.SendAsync(req);

            return JsonConvert.DeserializeObject<Class>(await res.Content.ReadAsStringAsync());
        }

        public async Task<List<Class>> GetSchedule()
        {
            var user = await GetLeisureCenterUser();
            var req = new HttpRequestMessage
            {
                RequestUri = new Uri($"https://parkwoodleisure.netpulse.com/np/exerciser/{user.Uuid}/schedule"),
                Method = HttpMethod.Get
            };

            req.Headers.Add("Cookie", user.AuthenticationCookieHeaderValue);

            var res = await _httpClient.SendAsync(req);

            var data = await res.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<List<Class>>(data)!.ToList();
        }
    }
}