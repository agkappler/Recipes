export default class RequestManager {
    private static baseUrl = process.env.NEXT_PUBLIC_API_URL;

    static async get(url: string): Promise<any> {
        const response = await fetch(this.baseUrl + url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return await this.handleResponse(response);
    }

    static async post(url: string, data: any): Promise<any> {
        const response = await fetch(this.baseUrl + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return await this.handleResponse(response);
    }
    static async put(url: string, data: any): Promise<any> {
        const response = await fetch(this.baseUrl + url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return await this.handleResponse(response);
    }

    private static async handleResponse(response: Response): Promise<any> {
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.errorMessage || "An error occurred while fetching data.");
        }

        return responseData;
    }
}