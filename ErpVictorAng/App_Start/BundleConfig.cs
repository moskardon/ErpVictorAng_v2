using System.Web;
using System.Web.Optimization;

namespace ErpVictorAng
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/vendors/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jquery-ui").Include(
            //            "~/Scripts/vendors/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/vendors/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/toastr").Include(
                        "~/Scripts/vendors/toastr.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/vendors/angular.min.js",
                        "~/Scripts/vendors/angular-*",
                        "~/Scripts/vendors/ngDialog.min.js",
                        "~/Scripts/vendors/angular-ui/ui-router.min.js",
                        "~/Scripts/vendors/angular-ui/ui-bootstrap-tpls.min.js"));


            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/vendors/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/vendors/bootstrap.js",
                      "~/Scripts/vendors/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/toastr.min.css",
                      "~/Content/ngDialog.min.css",
                      "~/Content/ngDialog-theme-plain.min.css",
                      "~/Content/ngDialog-theme-default.min.css"));
        }
    }
}
