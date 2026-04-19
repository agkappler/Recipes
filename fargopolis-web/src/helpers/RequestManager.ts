import FileMetadata from "@/models/FileMetadata";
import User from "@/models/User";

export default class RequestManager {
    private static baseUrl = import.meta.env.VITE_API_URL ?? "";
    private static apiUrl = `${this.baseUrl}/api`;
    private static baseGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL ?? "";
    private static gatewayApiUrl = `${this.baseGatewayUrl}/api`;

    static async get<T = unknown>(url: string): Promise<T> {
        return this.getWithBase<T>(this.apiUrl, url);
    }

    /** Bounty routes — use API Gateway + Lambda when `VITE_API_GATEWAY_URL` is set. */
    static async getGateway<T = unknown>(url: string): Promise<T> {
        return this.getWithBase<T>(
            this.gatewayApiUrl,
            url,
            "omit",
            RequestManager.mergeWireKey({ "Content-Type": "application/json" }),
        );
    }

    /** API key secret; must match Secrets Manager `apiKey`. */
    private static mergeWireKey(headers: HeadersInit): HeadersInit {
        const key = import.meta.env.VITE_API_KEY_SECRET?.trim();
        if (!key) return headers;
        const h = new Headers(headers);
        h.set("X-Api-Key", key);
        return h;
    }

    private static async getWithBase<T>(
        urlBase: string,
        path: string,
        credentials: RequestCredentials = "include",
        headers?: HeadersInit,
    ): Promise<T> {
        const response = await fetch(urlBase + path, {
            method: "GET",
            credentials,
            headers: headers ?? { "Content-Type": "application/json" },
        });

        return await this.handleResponse(response);
    }

    static async post<T = unknown>(url: string, data: T, customHeaders?: HeadersInit): Promise<T> {
        return this.postWithBase<T>(this.apiUrl, url, data, customHeaders);
    }

    /** Bounty mutations — use API Gateway + Lambda when `VITE_API_GATEWAY_URL` is set. */
    static async postGateway<T = unknown>(url: string, data: T, customHeaders?: HeadersInit): Promise<T> {
        const baseHeaders = customHeaders ?? { "Content-Type": "application/json" };
        return this.postWithBase<T>(
            this.gatewayApiUrl,
            url,
            data,
            RequestManager.mergeWireKey(baseHeaders),
            "omit",
        );
    }

    private static async postWithBase<T>(
        urlBase: string,
        path: string,
        data: T,
        customHeaders?: HeadersInit,
        credentials: RequestCredentials = "include",
    ): Promise<T> {
        const response = await fetch(urlBase + path, {
            method: "POST",
            credentials,
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

    static async delete<T = unknown>(url: string): Promise<T> {
        const response = await fetch(this.apiUrl + url, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
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
            let errorData: { errorMessage?: string; message?: string } = {
                errorMessage: "An error occurred while fetching data.",
            };
            try {
                errorData = await response.json();
            } catch (error) {
                console.error("Error parsing error response:", error);
            }

            const msg = errorData.errorMessage ?? errorData.message ?? "An error occurred while fetching data.";
            throw new Error(msg);
        }

        const responseData = await response.json();
        return responseData;
    }
}