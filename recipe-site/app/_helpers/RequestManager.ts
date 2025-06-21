import FileMetadata from "../_models/FileMetadata";
import User from "../_models/User";

export default class RequestManager {
    private static baseUrl = process.env.NEXT_PUBLIC_API_URL;
    private static apiUrl = this.baseUrl + "/api";

    static async get<T = unknown>(url: string): Promise<T> {
        const response = await fetch(this.apiUrl + url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return await this.handleResponse(response);
    }

    static async post<T = unknown>(url: string, data: T, customHeaders?: HeadersInit): Promise<T> {
        const response = await fetch(this.apiUrl + url, {
            method: "POST",
            credentials: "include",
            headers: customHeaders ?? {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return await this.handleResponse(response);
    }

    static async uploadFile(fileData: FormData) {
        const response = await fetch(this.apiUrl + "/uploadFile", {
            method: "POST",
            credentials: "include",
            body: fileData,
        });

        return await this.handleResponse<FileMetadata>(response);
    }

    static async put<T = unknown>(url: string, data: T): Promise<T> {
        const response = await fetch(this.apiUrl + url, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return await this.handleResponse(response);
    }

    static async authenticateUser(email: string, password: string): Promise<{ user: User }> {
        const response = await fetch(this.baseUrl + `/authentication/authenticateUser`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        return await this.handleResponse(response);
    }

    static async logout(): Promise<{ message: string }> {
        const response = await fetch(this.baseUrl + `/authentication/logout`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return await this.handleResponse(response);
    }

    private static async handleResponse<T = unknown>(response: Response): Promise<T> {
        if (!response.ok) {
            let errorData = { errorMessage: "An error occurred while fetching data." };
            try {
                errorData = await response.json();
            } catch (error) {
                console.error("Error parsing error response:", error);
            }

            throw new Error(errorData.errorMessage);
        }

        const responseData = await response.json();
        return responseData;
    }
}