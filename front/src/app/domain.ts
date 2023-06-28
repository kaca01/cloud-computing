export interface User {
    email: string,
    password: string, 
    name: string,
    surname: string, 
    code: string,
    telephoneNumber: string,
    address: string
}

export interface UploadFile {
    fileContent: string, 
    fileName: string,
    fileType: string,
    fileSize: number,
    fileCreated: string,
    fileModified: string,
    description:  string,
    tags: Array<any>,
    user: string
}