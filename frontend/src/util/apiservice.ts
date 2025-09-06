const apiUrl = import.meta.env.VITE_API_URL;

export const getAPI = async (url:string) => {
    const response = await fetch(`${apiUrl}/${url}`);
    if (!response.ok) throw new Error(`GET request failed: ${response.status}`);
    return response.json();
}

export const postAPI = async (url:string,data:JSON) => {
    const response = await fetch(`${apiUrl}/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`POST request failed: ${response.status}`);
    return response.json();
}