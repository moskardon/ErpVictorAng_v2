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
                        "~/Scripts/vendors/angular-cookies.min.js",
                        "~/Scripts/vendors/angular-sanitize.min.js",
                        "~/Scripts/vendors/angular-loader.min.js",
                        "~/Scripts/vendors/angular-resource.min.js",
                        "~/Scripts/vendors/angular-validator.min.js",
                        "~/Scripts/vendors/angular-base64.min.js",
                        "~/Scripts/vendors/ngDialog.min.js",
                        //"~/Scripts/vendors/angular-ui/ui-router.min.js",
                        //"~/Scripts/vendors/angular-ui/ui-bootstrap-tpls.min.js"));
                        "~/Scripts/vendors/angular-ui/angular-ui-router.min.js",
                        "~/Scripts/vendors/angular-ui/ui-bootstrap.min.js",
                        "~/Scripts/vendors/angular-ui/ui-bootstrap-tpls.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/erpApp.js",
                "~/Scripts/app/services/notificationService.js",
                "~/Scripts/app/services/apiService.js",
                "~/Scripts/app/services/membershipService.js",
                "~/Scripts/app/account/loginCtrl.js",
                "~/Scripts/app/account/registerCtrl.js",
                "~/Scripts/app/home/rootCtrl.js",
                "~/Scripts/app/home/indexCtrl.js",
                "~/Scripts/app/services/modalWindowFactory.js",
                "~/Scripts/app/division/divisionController.js",
                "~/Scripts/app/familia/familiaModController.js",
                "~/Scripts/app/familia/familiaController.js",
                "~/Scripts/app/subfamilia/subFamiliaModCtrl.js",
                "~/Scripts/app/subfamilia/subFamiliaController.js",
                "~/Scripts/app/tipoUnidad/tipoUnidadController.js",
                "~/Scripts/app/unidad/unidadController.js",
                "~/Scripts/app/articulo/articuloController.js",
                "~/Scripts/app/descuento/descuentoController.js",
                "~/Scripts/app/cliente/clienteModCtrl.js",
                "~/Scripts/app/cliente/clienteController.js",
                "~/Scripts/app/presupuesto/presupuestoModCtrl.js",
                "~/Scripts/app/presupuesto/presupuestoController.js",
                "~/Scripts/app/pedido/pedidoModCtrl.js",
                "~/Scripts/app/pedido/pedidoController.js"));


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
                      "~/Content/ngDialog-custom-width.css",
                      "~/Content/ngDialog-theme-plain.min.css",
                      "~/Content/ngDialog-theme-default.min.css"));
        }
    }
}
