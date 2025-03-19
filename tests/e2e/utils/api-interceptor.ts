import { Page, Route } from '@playwright/test'

// Extend Page type to include our custom method
export interface CustomPage extends Page {
  mockRoute: (url: string, handler: (route: Route) => Promise<void>) => Promise<void>
}

/**
 * Setup API request interceptor to catch unmocked API calls
 */
export const setupApiInterceptor = async (page: Page, interceptorURL: string) => {
  // Keep track of mocked routes
  const mockedRoutes = new Set<string>()

  // Intercept all API calls that are not explicitly mocked
  await page.route(interceptorURL, async (route) => {
    const request = route.request()
    const url = request.url()

    // Only catch fetch and xhr requests
    const requestType = request.resourceType()
    if (requestType !== 'fetch' && requestType !== 'xhr') {
      await route.continue()
      return
    }

    // If this route is mocked, let it pass through
    if (mockedRoutes.has(url)) {
      await route.continue()
      return
    }

    // else, reject the request with a clear error message
    const method = request.method()
    const postData = request.postData()

    console.error(`
      Unauthorized API call detected!
      URL: ${url}
      Method: ${method}
      Data: ${postData}
      Stack trace: ${new Error().stack}
    `)

    // Reject the request with a clear error message
    await route.abort('failed')
  })

  // Helper function to mock routes and track them
  const mockRoute = async (url: string, handler: (route: Route) => Promise<void>) => {
    mockedRoutes.add(url)
    await page.route(url, handler)
  }

  // Store the helper function on the page object for use in tests
  ;(page as CustomPage).mockRoute = mockRoute
}
