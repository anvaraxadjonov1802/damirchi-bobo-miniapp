import aiohttp


class BackendAPIError(Exception):
    pass


def build_api_url(backend_api_url: str, endpoint: str) -> str:
    base = backend_api_url.rstrip('/')
    path = endpoint if endpoint.startswith('/') else f'/{endpoint}'
    return f'{base}{path}'


async def read_response_json(response: aiohttp.ClientResponse) -> dict:
    try:
        return await response.json()
    except Exception:
        text = await response.text()
        return {'detail': text or 'Backenddan noto‘g‘ri javob keldi.'}


async def patch_order_status(
    backend_api_url: str,
    order_id: str | int,
    status: str,
) -> dict:
    url = build_api_url(backend_api_url, f'/orders/{order_id}/status/')
    timeout = aiohttp.ClientTimeout(total=15)

    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.patch(url, json={'status': status}) as response:
                data = await read_response_json(response)

                if response.status not in [200, 201]:
                    detail = (
                        data.get('detail')
                        or data.get('message')
                        or data.get('error')
                        or 'Backend status update error.'
                    )
                    raise BackendAPIError(str(detail))

                return data

    except BackendAPIError:
        raise
    except aiohttp.ClientConnectorError:
        raise BackendAPIError('Backendga ulanib bo‘lmadi.')
    except aiohttp.ClientTimeout:
        raise BackendAPIError('Backend javobi kechikdi. Qayta urinib ko‘ring.')
    except Exception as exc:
        raise BackendAPIError(f'Status yangilashda xatolik: {exc}')


async def get_restaurant_settings(backend_api_url: str) -> dict | None:
    url = build_api_url(backend_api_url, '/settings/')
    timeout = aiohttp.ClientTimeout(total=10)

    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                return await read_response_json(response)

    except Exception:
        return None
