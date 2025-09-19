# Real API Integration Setup Guide

This guide explains how to set up and configure the real API integration for the appointments system.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=1000

# App Configuration
VITE_APP_NAME=Clinic Admin
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
VITE_DEBUG=true

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_CACHING=true
VITE_ENABLE_ANALYTICS=false

# Cache Configuration
VITE_CACHE_APPOINTMENTS_TTL=300000
VITE_CACHE_APPOINTMENTS_MAX_SIZE=100
VITE_CACHE_USERS_TTL=600000
VITE_CACHE_USERS_MAX_SIZE=50
```

## API Endpoints

The system expects the following API endpoints to be available:

### Appointments

- `GET /appointments` - Get all appointments with filters and pagination
- `GET /appointments/:id` - Get appointment by ID
- `POST /appointments` - Create new appointment
- `PATCH /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment
- `PATCH /appointments/:id/status` - Update appointment status
- `PATCH /appointments/:id/reschedule` - Reschedule appointment
- `GET /appointments/my-appointments` - Get current user appointments
- `GET /appointments/pet/:petId` - Get appointments by pet
- `GET /appointments/clinic/:clinicId` - Get appointments by clinic
- `GET /appointments/staff/:staffId` - Get appointments by staff member
- `GET /appointments/today` - Get today's appointments
- `GET /appointments/upcoming` - Get upcoming appointments
- `GET /appointments/available-slots/:clinicId` - Get available time slots
- `GET /appointments/stats` - Get appointment statistics
- `PATCH /appointments/bulk-update` - Bulk update appointments
- `GET /appointments/export` - Export appointments

### Health Check

- `GET /health` - API health check endpoint

## Features Implemented

### 1. Real API Integration

- ✅ All appointment operations use real API endpoints
- ✅ Proper error handling and validation
- ✅ Request/response interceptors
- ✅ Authentication token management

### 2. Enhanced Error Handling

- ✅ Comprehensive error boundaries
- ✅ User-friendly error messages
- ✅ Retry logic for failed requests
- ✅ Offline support with cached data

### 3. Performance Optimizations

- ✅ Intelligent caching system
- ✅ Request deduplication
- ✅ Response time monitoring
- ✅ Optimistic updates

### 4. Data Validation

- ✅ Input validation before API calls
- ✅ Response data validation
- ✅ Type safety with TypeScript
- ✅ Proper error messages for validation failures

### 5. User Experience

- ✅ Loading states and spinners
- ✅ Success/error notifications
- ✅ Offline mode indicators
- ✅ Export functionality

## Backend Requirements

Your backend API should:

1. **Return proper HTTP status codes**
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 422: Validation Error
   - 500: Internal Server Error

2. **Follow consistent response format**

   ```json
   {
     "appointments": [...],
     "total": 100,
     "page": 1,
     "limit": 10
   }
   ```

3. **Handle authentication**
   - Use Bearer token authentication
   - Return 401 for expired/invalid tokens
   - Support token refresh if needed

4. **Implement proper validation**
   - Validate all input data
   - Return detailed validation errors
   - Sanitize data before processing

## Testing the Integration

1. **Start your backend API** on `http://localhost:3001`
2. **Set up environment variables** in `.env` file
3. **Start the frontend** with `pnpm dev`
4. **Navigate to appointments page** to test the integration

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from `http://localhost:3002`
2. **Authentication Errors**: Check that your backend properly validates Bearer tokens
3. **Network Errors**: Verify your backend is running and accessible
4. **Validation Errors**: Check the API response format matches expected structure

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` to see:

- API response times
- Cache hit/miss information
- Detailed error logs

## Performance Monitoring

The system automatically monitors:

- API response times
- Cache hit rates
- Error frequencies
- Network status

## Offline Support

When offline mode is enabled:

- Cached data is displayed when available
- User is notified of network status
- Failed requests fall back to cached data
- Automatic retry when connection is restored
