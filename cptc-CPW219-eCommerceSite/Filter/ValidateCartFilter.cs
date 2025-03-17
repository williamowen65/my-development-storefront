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

            //if (cookies.ContainsKey("merch-cart"))
            //{
            //    var cartItemsJson = cookies["merch-cart"];
            //    var cartItems = JsonSerializer.Deserialize<List<int>>(cartItemsJson);

            //    // print the cart items to the console
            //    Console.WriteLine("Cart items: " + string.Join(", ", cartItems));

            //}

         
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Do nothing after the action executes
        }
    }
}
