import { Controller, Get, Redirect, } from "routing-controllers";

// Redirects root route to swagger-ui
@Controller("/")
export class RootController {

    @Get()
    @Redirect("/swagger-ui")
    redirectToSwagger() {}
}