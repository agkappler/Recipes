export default class RequestManager {
    private static baseUrl = process.env.NEXT_PUBLIC_API_URL;

    static async get(url: string): Promise<any> {
        const response = await fetch(this.baseUrl + url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    static async post(url: string, data: any): Promise<any> {
        const response = await fetch(this.baseUrl + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    static async put(url: string, data: any): Promise<any> {
        const response = await fetch(this.baseUrl + url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
}