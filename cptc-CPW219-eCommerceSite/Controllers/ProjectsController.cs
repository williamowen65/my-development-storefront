using Microsoft.AspNetCore.Mvc;

namespace cptc_CPW219_eCommerceSite.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [Route("projects/{id}")]
        public IActionResult Projects(string id)
        {
            // You can use the id parameter to fetch the specific project details
            ViewData["ProjectId"] = id;
            return View("_projects/" + id);
        }
    }
}
