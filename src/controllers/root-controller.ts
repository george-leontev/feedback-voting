import { Controller, Get, Redirect, } from "routing-controllers";

@Controller("/")
export class RootController {

    @Get()
    @Redirect("/swagger-ui")
    redirectToSwagger() {}
}