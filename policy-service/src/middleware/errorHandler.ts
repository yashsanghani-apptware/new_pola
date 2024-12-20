import { Response } from 'express';

/**
 * Handles errors in the application by sending a standardized JSON response.
 * This function ensures that the response object is valid and then sends a
 * 500 Internal Server Error status with the error message.
 *
 * @param res - The Express response object used to send the error response.
 * @param error - The error object, which can be of any type.
 *                If it is an instance of Error, the error message will be extracted.
 */
export function handleErrorX(res: Response, error: unknown): void {
    // Check if the response object has a valid 'status' function
    if (typeof res.status !== 'function') {
        console.error('Invalid Response object:', res);
        throw new Error('Invalid Response object');
    }

    // Determine the error message to be sent in the response
    const message = error instanceof Error ? error.message : 'Unknown error';

    // Send a 500 Internal Server Error response with the error message
    res.status(500).json({ error: message });
}
export function handleError(res: Response, error: unknown): void {
  if (error instanceof Error) {
    // It's a regular Error object
    console.error(error.message);
    res.status(500).json({ message: error.message });
  } else {
    // Handle other types of errors if needed
    console.error('An unknown error occurred', error);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
}

