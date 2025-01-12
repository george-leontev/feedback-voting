import { Controller, Get, Redirect, Res, } from "routing-controllers";

@Controller("/")
export class RootController {

    @Get()
    @Redirect("/swagger-ui")
    redirectToSwagger() {}
}