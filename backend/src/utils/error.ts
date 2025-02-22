export function handleError(error: unknown) {
    return {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 500
    };
}