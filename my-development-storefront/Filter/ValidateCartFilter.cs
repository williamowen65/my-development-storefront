using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using cptc_CPW219_eCommerceSite.data;
using System.Text.Json;

namespace cptc_CPW219_eCommerceSite.Filter
{

    public class ValidateCartFilter : IActionFilter
    {
        private readonly ECommerceContext _context;

        public ValidateCartFilter(ECommerceContext context)
        {
            _context = context;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var cookies = context.HttpContext.Request.Cookies;
            Console.WriteLine("WOULD VALIDATE COOKIE");

            // Print cookie values
            foreach (var cookie in cookies)
            {
                if (cookie.Key == "merch-cart") { 
               
                Console.WriteLine($"\nCookie Name: {cookie.Key}, Cookie Value: {cookie.Value}\n");
                }
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Do nothing after the action executes
        }
    }
}
