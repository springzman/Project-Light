function createError(message, code, origName, messageVars, numericErrorCode, errorData) {
    return {
        errorCode: origName || "errors.com.epicgames.common.server_error",
        errorMessage: message,
        messageVars: messageVars || [],
        numericErrorCode: numericErrorCode || 1001,
        originatingService: "fortnite",
        intent: "prod",
        error_description: message,
        error: origName || "server_error",
        ...errorData
    };
}

module.exports = {
    createError,
    
    // Common errors
    invalidToken: () => createError("Sorry, your login credentials are invalid. Please try again.", 401, "errors.com.epicgames.common.oauth.invalid_token", [], 1032),
    
    invalidAccount: () => createError("Sorry, your account could not be found.", 404, "errors.com.epicgames.account.account_not_found", [], 18031),
    
    operationNotFound: (operation) => createError(`Operation ${operation} not found.`, 404, "errors.com.epicgames.fortnite.operation_not_found", [operation], 16027),
    
    invalidBody: () => createError("Invalid request body.", 400, "errors.com.epicgames.common.bad_request", [], 1001),
    
    insufficientPermissions: () => createError("Sorry, you do not have permission to perform this action.", 403, "errors.com.epicgames.common.insufficient_permissions", [], 1023),
    
    notFound: () => createError("Resource not found.", 404, "errors.com.epicgames.common.not_found", [], 1004)
};
