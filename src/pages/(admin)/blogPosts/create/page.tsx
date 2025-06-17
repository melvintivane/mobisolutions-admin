import { useState, useRef } from 'react';
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageMetaData from "@/components/PageTitle";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { useMutation } from "react-query";
import { createBlog } from "@/services/blogService";
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import { toast } from 'react-toastify';

const BlogPostCreate = () => {
  const navigate = useNavigate();
  const authorImgInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    blogTitle: "",
    mainText: "",
    quoteText: "",
    authorProfileImg: "",
    thumb: "",
    authorName: "",
    authorResume: "",
    status: "draft" as const,
    date: new Date().toISOString(),
    btnText: "Continuar Lendo",
    btnIcon: "fa-solid fa-arrow-right",
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fieldBeingUploaded, setFieldBeingUploaded] = useState<"authorProfileImg" | "thumb" | null>(null);

  const mutation = useMutation(createBlog, {
    onSuccess: () => {
      navigate("/blog");
    },
    onError: (error: any) => {
      console.error("Error creating blog post:", error);
      alert("Error creating blog post. Please try again.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (file: File, fieldName: 'authorProfileImg' | 'thumb') => {
    try {
      setIsUploading(true);
      setFieldBeingUploaded(fieldName);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_ENDPOINTS.UPLOAD_IMAGE}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        [fieldName]: data.imageUrl
      }));

      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image. Please try again.');
      throw error;
    } finally {
      setIsUploading(false);
      setFieldBeingUploaded(null);
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'authorProfileImg' | 'thumb'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      try {
        const imageUrl = await handleFileUpload(file, fieldName);
        setFormData(prev => ({
          ...prev,
          [fieldName]: imageUrl
        }));
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.authorProfileImg) {
      alert('Please upload author profile image');
      return;
    }

    if (!formData.blogTitle || !formData.mainText || !formData.authorName || !formData.authorResume) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <PageMetaData title="Create Blog Post" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-create-form"
            title="Create New Blog Post"
            description="Fill in the form below to create a new blog post"
          >
            <Form onSubmit={handleSubmit}>
              {/* Author Information */}
              <div className="mb-4">
                <h5 className="mb-3">Author Information</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="authorName">
                      <Form.Label>Author Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="authorName"
                        value={formData.authorName}
                        onChange={handleChange}
                        required
                        disabled={isUploading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="authorResume">
                      <Form.Label>Author Resume *</Form.Label>
                      <Form.Control
                        type="text"
                        name="authorResume"
                        value={formData.authorResume}
                        onChange={handleChange}
                        required
                        disabled={isUploading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="authorProfileImg">
                      <Form.Label>Author Profile Image *</Form.Label>
                      <Form.Control
                        type="file"
                        ref={authorImgInputRef}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e, 'authorProfileImg')}
                        accept="image/*"
                        required
                        disabled={isUploading}
                      />
                      {isUploading && fieldBeingUploaded === 'authorProfileImg' && (
                        <div className="mt-2">
                          <progress value={uploadProgress} max="100" className="w-100" />
                          <span>{uploadProgress}%</span>
                        </div>
                      )}
                      {formData.authorProfileImg && (
                        <div className="mt-2">
                          <img 
                            src={formData.authorProfileImg} 
                            alt="Author preview" 
                            style={{ maxWidth: '100px', maxHeight: '100px' }} 
                          />
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="thumb">
                      <Form.Label>Post Thumbnail</Form.Label>
                      <Form.Control
                        type="file"
                        ref={thumbInputRef}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e, 'thumb')}
                        accept="image/*"
                        disabled={isUploading}
                      />
                      {isUploading && fieldBeingUploaded === 'thumb' && (
                        <div className="mt-2">
                          <progress value={uploadProgress} max="100" className="w-100" />
                          <span>{uploadProgress}%</span>
                        </div>
                      )}
                      {formData.thumb && (
                        <div className="mt-2">
                          <img 
                            src={formData.thumb} 
                            alt="Thumbnail preview" 
                            style={{ maxWidth: '100px', maxHeight: '100px' }} 
                          />
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h5 className="mb-3">Post Content</h5>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="blogTitle">
                      <Form.Label>Post Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="blogTitle"
                        value={formData.blogTitle}
                        onChange={handleChange}
                        required
                        disabled={isUploading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="mainText">
                      <Form.Label>Main Content *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="mainText"
                        value={formData.mainText}
                        onChange={handleChange}
                        required
                        disabled={isUploading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="quoteText">
                      <Form.Label>Quote Text</Form.Label>
                      <Form.Control
                        type="text"
                        name="quoteText"
                        value={formData.quoteText}
                        onChange={handleChange}
                        disabled={isUploading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Post Settings */}
              <div className="mb-4">
                <h5 className="mb-3">Post Settings</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="status">
                      <Form.Label>Status *</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        disabled={isUploading}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="date">
                      <Form.Label>Publish Date *</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="date"
                        value={new Date(formData.date).toISOString().slice(0, 16)}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            date: new Date(e.target.value).toISOString(),
                          }));
                        }}
                        required
                        disabled={isUploading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={mutation.isLoading || isUploading}
                  className="me-1"
                >
                  {mutation.isLoading ? "Creating..." : "Create Post"}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate("/blog")}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  );
};

export default BlogPostCreate;