import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Row, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { getVacancyById } from "@/services/blogService";
import PageMetaData from "@/components/PageTitle";
import type { BlogPost } from "@/types/blog";
// import SubmissionButton from "./components/SubmissionButton";

import logoDark from "@/assets/images/logo-dark-full.png";
import logoLight from "@/assets/images/logo-light-full.png";

const BlogPostDetails = () => {
  const [blogPost, setBlogPost] = useState<BlogPost>();
  const { blogPostId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (blogPostId) {
        const data = await getVacancyById(blogPostId);
        if (data) setBlogPost(data);
        else navigate("/pages/error-404-alt");
      }
    })();
  }, [blogPostId, navigate]);

  return (
    <>
      <PageMetaData title={blogPost?.blogTitle ?? "Blog Post Details"} />

      <Row>
        <Col xs={12}>
          {blogPost && (
            <Card>
              <CardBody>
                <div className="clearfix">
                  <div className="float-sm-end">
                    <div className="auth-logo">
                      <img
                        className="logo-dark me-1"
                        height={24}
                        src={logoDark}
                        alt="logo-dark"
                      />
                      <img
                        className="logo-light me-1"
                        height={24}
                        src={logoLight}
                        alt="logo-light"
                      />
                    </div>
                    <address className="mt-3">
                      Rua da Amizade, 41
                      <br />
                      Maputo 1101, MZ <br />
                      <abbr title="Telefone">T:</abbr> (+258) 82 530 9675
                    </address>
                  </div>
                  <div className="float-sm-start">
                    <CardTitle as={"h5"} className="mb-2">
                      {blogPost.blogTitle}
                    </CardTitle>
                    <div className="d-flex gap-2 align-items-center">
                      <Badge
                        pill
                        bg={
                          blogPost.status === "published"
                            ? "success"
                            : blogPost.status === "archived"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {blogPost.status}
                      </Badge>
                      <span className="text-muted">#{blogPost._id}</span>
                    </div>
                    <div className="mt-2">
                      <img 
                        src={blogPost.thumb} 
                        alt="Post thumbnail" 
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  </div>
                </div>

                <Row className="mt-4">
                  <Col md={6}>
                    <h6 className="fw-normal text-muted">Author Details</h6>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={blogPost.authorProfileImg}
                        alt="Author"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                      />
                      <div>
                        <div className="fw-medium">{blogPost.authorName}</div>
                        <small className="text-muted">{blogPost.authorResume}</small>
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong>Published Date:</strong>{" "}
                      {new Date(blogPost.date).toLocaleDateString()}
                    </div>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <h6 className="fw-normal text-muted">Post Content</h6>
                    <div className="p-3 bg-light rounded">
                      {blogPost.mainText}
                    </div>
                  </Col>
                </Row>

                {blogPost.quoteText && (
                  <Row className="mt-3">
                    <Col xs={12}>
                      <h6 className="fw-normal text-muted">Featured Quote</h6>
                      <blockquote className="blockquote bg-primary text-white p-3 rounded">
                        <p>{blogPost.quoteText}</p>
                      </blockquote>
                    </Col>
                  </Row>
                )}

                {/* <div className="mt-5 mb-1">
                  <SubmissionButton 
                    btnText={blogPost.btnText}
                    btnIcon={blogPost.btnIcon}
                  />
                </div> */}
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default BlogPostDetails;