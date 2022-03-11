import { i18n } from "@/shared/system/localizations";
import { Request, Response } from "express";

interface HelloResponse {
  hello: string;
}

type HelloBuilder = (name: string) => HelloResponse;

const helloBuilder: HelloBuilder = name => ({ hello: name });

export default (_req: Request, res: Response) => {
    const t = i18n(_req.acceptsLanguages()[0]);
    console.log(t);
    return res.send(`Hello, Your API is working!! ${ t.common.labels.mailAddress }`);
};

export const helloHandler = (req: Request, res: Response) => {
    const { params } = req;
    const { name = "World" } = params;
    const response = helloBuilder(name);

    return res.json(response);
};