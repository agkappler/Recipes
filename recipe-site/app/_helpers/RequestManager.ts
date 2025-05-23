
export default class RequestManager {
    private static baseUrl = process.env.NEXT_PUBLIC_API_URL;
    private static apiUrl = this.baseUrl + "/api";

    static async get(url: string): Promise<any> {
        const response = await fetch(this.apiUrl + url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return await this.handleResponse(response);
    }

    static async post(url: string, data: any): Promise<any> {
        const response = await fetch(this.apiUrl + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return await this.handleResponse(response);
    }

    static async put(url: string, data: any): Promise<any> {
        const response = await fetch(this.apiUrl + url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return await this.handleResponse(response);
    }

    static async authenticateUser(email: string, password: string): Promise<any> {
        const response = await fetch(this.baseUrl + `/authenticateUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        return await this.handleResponse(response);
    }

    private static async handleResponse(response: Response): Promise<any> {
        if (!response.ok) {
            let errorData = { errorMessage: "An error occurred while fetching data." };
            try {
                errorData = await response.json();
            } catch (error) {
                console.error("Error parsing error response:", error);
            }

            throw new Error(errorData.errorMessage || "An error occurred while fetching data.");
        }

        const responseData = await response.json();
        return responseData;
    }
}