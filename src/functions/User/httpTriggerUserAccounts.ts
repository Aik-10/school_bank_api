import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Authenticate } from "../../Routes/Middlewares/Auth";

type AccountProps = {
    id?: number
}

async function UserInformation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const auth = await Authenticate(request, context);
    if (auth?.status !== true) return auth;
    
    const { id }: AccountProps = request.params;
    
    console.log(id)

    context.log('Http function was triggered.');
    return { jsonBody: auth };
};

app.http('user-accounts', {
    route: "user/accounts/{id?}",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: UserInformation
});

