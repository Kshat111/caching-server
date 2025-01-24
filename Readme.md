
# Caching Proxy Server

## Overview

This project implements a simple **Caching Proxy Server** using Node.js. A proxy server acts as an intermediary between a client (such as a web browser) and an origin server (the server hosting the requested resources). This caching proxy server stores HTTP responses to improve performance by serving cached responses to repeated requests, reducing the load on the origin server.

The project is designed to:
1. Forward HTTP requests from a client to the origin server.
2. Cache the response from the origin server.
3. Serve the cached response for future requests, reducing latency and load on the origin server.

The project uses a `cache.json` file to store the cached responses, allowing the proxy server to serve cached data even after a restart.

## Theory Behind the Project

A **Caching Proxy Server** works by intercepting HTTP requests from a client and checking if the requested data is already stored in a local cache. If the data is present in the cache, the proxy serves it directly to the client, bypassing the origin server. If the data is not in the cache, the proxy forwards the request to the origin server, stores the response, and then serves the data to the client.

### Key Concepts:
1. **HTTP Methods**: The proxy works with different HTTP methods like `GET`, `POST`, etc. In this project, we focus on `GET` requests.
2. **Caching**: Cached responses are stored with their headers and body. The cache is checked every time a request is received. If the response for a request is already cached, it's served from the cache.
3. **Cache Expiry**: The current implementation does not include cache expiry. All responses are stored until the cache is manually cleared or the proxy is restarted.
4. **Cache HIT & MISS**: If a response is served from the cache, it's a **HIT**. If the response is fetched from the origin server, it's a **MISS**.

## Features
- Implements caching for `GET` requests.
- Saves cached data in a `cache.json` file.
- Supports cache hit/miss detection.
- Easy to extend for additional HTTP methods and cache expiration.

## How to Run the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node package manager)

### Steps to Run Locally

1. **Clone the repository**:

   ```bash
   git clone git@github.com:Kshat111/caching-server.git
   cd caching-server
   ```

2. **Install dependencies**:

   Ensure you have all the required dependencies by running:

   ```bash
   npm install
   ```

3. **Run the caching proxy server**:

   You need to specify two options when running the server:
   - `--origin`: The origin server URL (the server from which the proxy will fetch data).
   - `--port`: The port on which the proxy server will run.

   Example command to start the server:

   ```bash
   node caching-proxy.js start --origin=http://example.com --port=3000
   ```

   This command will start the proxy server on port 3000 and fetch data from `http://example.com`.

4. **Use the proxy server**:

   After the server is running, you can open your web browser or send HTTP requests to the proxy server (`http://localhost:3000`). The proxy will forward these requests to the origin server, cache the responses, and serve them on subsequent requests.

   Example of accessing a cached page:

   ```bash
   curl http://localhost:3000/
   ```

   If the page is already cached, the proxy will return the cached response. Otherwise, it will forward the request to the origin server and cache the response.

5. **Clear the cache** (optional):

   To clear the cache, run the following command:

   ```bash
   node caching-proxy.js clear-cache
   ```

   This will delete the `cache.json` file and clear all cached data.

## Advantages of Using a Caching Proxy Server

1. **Improved Performance**:
   - Serving cached responses significantly reduces the time it takes to fetch data from the origin server, resulting in faster load times for frequently accessed resources.
   - Reduces latency by serving data from the local cache rather than requesting it from a remote server each time.

2. **Reduced Load on Origin Server**:
   - By serving cached responses, the proxy reduces the number of requests sent to the origin server. This helps minimize the load on the server, especially during periods of high traffic.

3. **Better Scalability**:
   - Using a caching proxy allows you to scale applications more effectively by reducing the need for repeated requests to the origin server, improving the overall efficiency of the system.

4. **Cost Savings**:
   - Reducing the load on the origin server can lower infrastructure costs, as fewer resources are needed to handle the requests.

5. **Offline Access**:
   - Cached responses can allow users to access previously requested resources even if the origin server is temporarily unavailable, depending on the cache configuration.

## Use Cases

1. **Web Caching for Static Resources**:
   - Proxy servers are commonly used to cache static resources (such as HTML pages, images, and scripts) to reduce server load and speed up web page rendering.
   
2. **API Gateway**:
   - A caching proxy can be used as an API gateway to cache API responses, reducing the load on backend services and improving the performance of API calls.

3. **Content Delivery Networks (CDNs)**:
   - A caching proxy can act as an edge server in a CDN, caching content closer to the user to reduce latency and improve the user experience.

4. **Web Scraping**:
   - If you're scraping data from websites, a caching proxy can store previously fetched data to avoid making repeated requests to the same resource, saving time and bandwidth.

## Future Improvements
- Implement cache expiration and invalidation strategies (e.g., TTL - Time To Live).
- Support for caching more HTTP methods (POST, PUT, DELETE).
- Improve error handling and logging.
- Add a user interface for easier management of the proxy.

