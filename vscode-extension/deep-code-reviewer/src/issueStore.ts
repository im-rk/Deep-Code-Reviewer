export interface Issue{
    id:string,
    type:string,
    description:string,
    line:string,
    suggestion:string,
    corrected:string
}

export const issueStore=new Map<string,Issue>();  