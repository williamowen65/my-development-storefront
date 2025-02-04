using Microsoft.AspNetCore.Mvc;

namespace cptc_CPW219_eCommerceSite.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
