"""

"""

from fastapi import Request, HTTPException
import time
from collections import defaultdict

request_counts = defaultdict(list)

def rate_limiter(max_requests:int = 5, window_seconds:int = 60):
    def dependency(request: Request):
        client_ip = request.client.host
        now = time.time()

        request_counts[client_ip] = [t for t in request_counts[client_ip] if now-t < window_seconds]

        if len(request_counts[client_ip]) >= max_requests:
            raise HTTPException(status_code=429, detail="Rate limit exceeded!")
        
        request_counts[client_ip].append(now)

    return dependency



