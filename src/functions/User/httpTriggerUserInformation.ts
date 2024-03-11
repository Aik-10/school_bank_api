import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Authenticate } from "../../Routes/Middlewares/Auth";
import { PersonModel } from "../../Models/PersonModel";

async function UserInformation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const auth = await Authenticate(request, context);
    if (auth?.status !== true) return auth;
    
    const { user }: { status: true, user: AuthToken } = auth;

    console.log(user?._id)

    console.log(user?._id)

    const person = new PersonModel(user?._id);
    
    console.log(person.personData)

    return { jsonBody: auth };
};

app.http('user-information', {
    route: "user",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: UserInformation
});

