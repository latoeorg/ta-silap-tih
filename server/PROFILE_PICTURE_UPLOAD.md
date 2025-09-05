# Profile Picture Upload Feature

## Overview

This feature allows students and teachers to upload and update their profile pictures through the API.

## Implementation Details

### 1. File Upload Middleware

- Located in `middleware/upload.ts`
- Uses `multer` for handling multipart/form-data
- Stores files in `uploads/profile-pictures/` directory
- Supports only image files (jpeg, png, gif, etc.)
- Maximum file size: 5MB
- Files are renamed with pattern: `profile-{userId}-{timestamp}.{extension}`

### 2. API Endpoint

**PUT** `/api/v1/user/profile/update`

#### Authentication

- Requires valid JWT token
- Available to: STUDENT, TEACHER, ADMIN roles

#### Request Format

- Content-Type: `multipart/form-data`
- Form fields:
  - `profilePicture`: Image file (optional)
  - Other profile fields as JSON or form data

#### Example using curl:

```bash
curl -X PUT \
  http://localhost:3001/api/v1/user/profile/update \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profilePicture=@/path/to/image.jpg" \
  -F "name=John Doe" \
  -F "phone=+1234567890"
```

#### Example using JavaScript/Fetch:

```javascript
const formData = new FormData();
formData.append("profilePicture", fileInput.files[0]);
formData.append("name", "John Doe");
formData.append("phone", "+1234567890");

fetch("/api/v1/user/profile/update", {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### 3. Response Format

```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "id": "profile-id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profilePicture": "/uploads/profile-pictures/profile-userId-timestamp.jpg",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT"
    }
  }
}
```

### 4. Features

- **Automatic file cleanup**: Old profile pictures are automatically deleted when a new one is uploaded
- **Error handling**: If profile update fails, uploaded files are cleaned up
- **Static file serving**: Uploaded images are accessible via HTTP at `/uploads/profile-pictures/{filename}`
- **Security**: Only authenticated users can upload, only image files allowed
- **File size limit**: 5MB maximum file size

### 5. File Storage

- Files are stored in the `uploads/profile-pictures/` directory
- The `uploads/` directory is excluded from git via `.gitignore`
- Profile picture URLs are stored in the database as relative paths

### 6. Database Schema

The `profilePicture` field should be present in both:

- `StudentProfile.profilePicture` (String, optional)
- `TeacherProfile.profilePicture` (String, optional)

### 7. Error Handling

Common error scenarios:

- **File too large**: Returns 400 with "File too large" message
- **Invalid file type**: Returns 400 with "Only image files are allowed" message
- **No user found**: Returns 404 with "User not found" message
- **Server error**: Returns 500 with error details

## Testing

To test the feature:

1. Start the server: `pnpm dev`
2. Use an API client (Postman, Insomnia) or curl to make requests
3. Include a valid JWT token in the Authorization header
4. Send a multipart/form-data request with an image file

## Security Considerations

1. File type validation (only images)
2. File size limits (5MB)
3. Authentication required
4. Unique filenames prevent conflicts
5. Old files are cleaned up to prevent storage bloat
