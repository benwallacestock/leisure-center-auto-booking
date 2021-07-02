using System;
using Hangfire;
using Hangfire.Dashboard;
using Hangfire.SqlServer;
using leisure_center_bookings.Models;
using leisure_center_bookings.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace leisure_center_bookings
{
    public class LeisureCenterConfiguration
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<LeisureCenterConfiguration>(Configuration.GetSection("LeisureCenter"));
            
            services.AddControllersWithViews();

            services.AddDbContext<LeisureCenterDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            
            services.AddHangfire(configuration => configuration.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(Configuration.GetConnectionString("DefaultConnection"), new SqlServerStorageOptions
                {
                    CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                    SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                    QueuePollInterval = TimeSpan.Zero,
                    UseRecommendedIsolationLevel = true,
                    DisableGlobalLocks = true
                }));

            // Add the processing server as IHostedService
            services.AddHangfireServer();

            services.AddScoped<ILeisureCenterService, LeisureCenterService>();
            services.AddScoped<IClassQueueService, ClassQueueService>();
            
            services.AddHttpClient("leisureCenterClient", c =>
            {
                c.DefaultRequestHeaders.Add("x-np-user-agent", "applicationVersion=1.10; clientType=MOBILE_DEVICE; containerName=ParkwoodLeisure; deviceUid=1eef7ce4b2658449; applicationVersionCode=132; devicePlatform=ANDROID; applicationName=Parkwood");
                c.DefaultRequestHeaders.Add("x-np-api-version", "1.5");
                c.DefaultRequestHeaders.Add("x-np-app-version", "1.10");
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });
        }
        
        public class MyAuthorizationFilter : IDashboardAuthorizationFilter
        {
            public bool Authorize(DashboardContext context)
            {
                return true;
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IBackgroundJobClient backgroundJobs, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                
                if (env.IsDevelopment())
                {
                    endpoints.MapHangfireDashboard("/hangfire", new DashboardOptions
                    {
                        Authorization = new [] { new MyAuthorizationFilter() }
                    });
                }
            });
            
            RecurringJob.AddOrUpdate<IClassQueueService>("CheckClassQueue", x => x.CheckQueue(), "*/5 * * * *");
            
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp/dist";

                if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:8082");
                }
            });
            
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<LeisureCenterDbContext>();
                context.Database.Migrate();
            }
            
            
        }
    }
}