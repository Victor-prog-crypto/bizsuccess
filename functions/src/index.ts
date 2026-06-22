import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";

type HandlerBody = Record<string, unknown> | unknown[];

type ReadOnlyRequest = {
  method: string;
  get(headerName: string): string | undefined;
};

type JsonResponse = {
  set(field: string, value: string): JsonResponse;
  status(code: number): JsonResponse;
  json(body: HandlerBody): void;
};

const HTTPS_OPTIONS = {
  cors: true,
} as const;

function sendReadOnlyJson(response: JsonResponse, body: HandlerBody) {
  response.set("Cache-Control", "public, max-age=60");
  response.status(200).json(body);
}

function handleReadOnlyRequest(
  endpointName: string,
  request: ReadOnlyRequest,
  response: JsonResponse,
  buildBody: () => HandlerBody,
) {
  try {
    if (request.method !== "GET") {
      response.set("Allow", "GET");
      response.status(405).json({ error: "Method not allowed" });
      return;
    }

    sendReadOnlyJson(response, buildBody());
  } catch (error) {
    logger.error(`${endpointName} placeholder failed`, error);
    response.status(500).json({ error: "Internal server error" });
  }
}

// Future Bizsaas Firebase replacement for https://api.dyad.sh/v1/desktop-config.
// Safe read-only placeholder: does not inspect secrets or mutate state.
export const getDesktopConfig = onRequest(
  HTTPS_OPTIONS,
  (request: ReadOnlyRequest, response: JsonResponse) => {
    handleReadOnlyRequest("getDesktopConfig", request, response, () => ({
      proEnabled: false,
      cloudSandboxEnabled: false,
      logUploadEnabled: false,
      oauthEnabled: false,
      engineProviderEnabled: false,
      message: "Bizsaas Firebase desktop config placeholder",
    }));
  },
);

// Future Bizsaas Firebase replacement for https://api.dyad.sh/v1/templates.
// Safe read-only placeholder: returns only static mock Bizsaas templates.
export const getTemplates = onRequest(
  HTTPS_OPTIONS,
  (request: ReadOnlyRequest, response: JsonResponse) => {
    handleReadOnlyRequest("getTemplates", request, response, () => ({
      templates: [
        {
          id: "bizsaas-basic-dashboard",
          name: "Bizsaas Basic Dashboard",
          description: "Safe mock dashboard template placeholder for Bizsaas.",
          tags: ["mock", "dashboard"],
        },
        {
          id: "bizsaas-landing-page",
          name: "Bizsaas Landing Page",
          description: "Safe mock landing page template placeholder for Bizsaas.",
          tags: ["mock", "landing"],
        },
      ],
    }));
  },
);

// Future Bizsaas Firebase replacement for https://api.dyad.sh/v1/language-model-catalog.
// Safe read-only placeholder: contains no provider secrets, API keys, or live routing data.
export const getLanguageModelCatalog = onRequest(
  HTTPS_OPTIONS,
  (request: ReadOnlyRequest, response: JsonResponse) => {
    handleReadOnlyRequest("getLanguageModelCatalog", request, response, () => ({
      providers: [
        {
          id: "placeholder-provider",
          name: "Placeholder Provider",
          models: [
            {
              id: "placeholder-chat-model",
              name: "Placeholder Chat Model",
              capabilities: ["chat"],
              default: true,
            },
          ],
        },
      ],
    }));
  },
);

// Future Bizsaas Firebase replacement for https://api.dyad.sh/v1/user/info.
// Safe read-only placeholder: currently unauthenticated, with request access isolated so
// Firebase Auth checks can be added here later without changing callers.
export const getUserLicense = onRequest(
  HTTPS_OPTIONS,
  (request: ReadOnlyRequest, response: JsonResponse) => {
    handleReadOnlyRequest("getUserLicense", request, response, () => {
      const authorizationHeader = request.get("authorization");

      return {
        plan: "free",
        active: true,
        features: {
          byok: true,
          engineProvider: false,
          cloudSandbox: false,
          logUpload: false,
        },
        // Temporary compatibility placeholders for the desktop app budget shape.
        // These values must not be used for paid-license enforcement.
        usedCredits: 0,
        totalCredits: 0,
        budgetResetDate: null,
        redactedUserId: "anonymous",
        isTrial: false,
        auth: {
          required: false,
          provided: Boolean(authorizationHeader),
        },
      };
    });
  },
);
