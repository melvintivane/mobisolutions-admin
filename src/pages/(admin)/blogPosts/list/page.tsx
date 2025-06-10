import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Row, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { getAllBlogPosts } from "@/services/blogService";
import type { BlogPost } from "@/types/blog";

const BlogPostList = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  const [blogPosts, setBlogPosts] = useState<{
    posts: BlogPost[];
    totalPosts: number;
    totalPages: number;
    currentPage: number;
  }>();

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, limit: newSize, page: 1 }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllBlogPosts(pagination.page, pagination.limit);
      setBlogPosts(data);
    };
    fetchData();
  }, [pagination.page, pagination.limit]);

  return (
    <>
      <PageMetaData title="Blog Posts" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <div className="search-bar">
                  <span>
                    <IconifyIcon icon="bx:search-alt" className="mb-1" />
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    id="search"
                    placeholder="Search blog posts..."
                  />
                </div>
                <div>
                  <Link to="/blog/create" className="btn btn-success ms-2">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Create New Post
                  </Link>
                </div>
              </div>
            </CardBody>
            <div>
              <div className="table-responsive table-centered">
                <table className="table text-nowrap mb-0">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      <th className="border-0 py-2">Post Title</th>
                      <th className="border-0 py-2">Author</th>
                      <th className="border-0 py-2">Status</th>
                      <th className="border-0 py-2">Published Date</th>
                      <th className="border-0 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts?.posts.map((post) => (
                      <tr key={post._id}>
                        <td>
                          <Link to={`/blog/${post._id}`} className="fw-medium">
                            {post.blogTitle}
                          </Link>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={post.authorProfileImg}
                              // alt={post.authorName}
                              className="rounded-circle me-2"
                              width="32"
                              height="32"
                            />
                            {post.authorName}
                          </div>
                        </td>
                        <td>
                          <Badge
                            pill
                            bg={
                              post.status === "published"
                                ? "success"
                                : post.status === "archived"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {post.status}
                          </Badge>
                        </td>
                        <td>
                          {new Date(post.date).toLocaleDateString()}
                        </td>
                        <td>
                          <Button
                            variant="soft-secondary"
                            size="sm"
                            type="button"
                            className="me-2"
                            // as={Link}
                            // to={`/blog/edit/${post._id}`}
                          >
                            <IconifyIcon icon="bx:edit" className="fs-16" />
                          </Button>
                          <Button variant="soft-danger" size="sm" type="button">
                            <IconifyIcon
                              icon="bx:trash"
                              className="bx bx-trash fs-16"
                            />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
                <div className="col-sm">
                  <div className="text-muted">
                    Showing{" "}
                    <span className="fw-semibold">
                      {blogPosts?.posts.length}
                    </span>{" "}
                    of{" "}
                    <span className="fw-semibold">
                      {blogPosts?.totalPosts}
                    </span>{" "}
                    posts
                    <select
                      className="form-select form-select-sm ms-2 d-inline-block w-auto"
                      value={pagination.limit}
                      onChange={(e) =>
                        handlePageSizeChange(Number(e.target.value))
                      }
                    >
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size} per page
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Col sm="auto" className="mt-3 mt-sm-0">
                  <ul className="pagination pagination-rounded m-0">
                    <li
                      className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.page === 1}
                      >
                        <IconifyIcon icon="bx:left-arrow-alt" />
                      </button>
                    </li>
                    <li
                      className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Prev
                      </button>
                    </li>

                    {Array.from(
                      { length: Math.min(5, blogPosts?.totalPages || 1) },
                      (_, i) => {
                        let pageNum: number;
                        const totalPages = blogPosts?.totalPages || 1;

                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <li
                            key={pageNum}
                            className={`page-item ${pagination.page === pageNum ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      }
                    )}

                    <li
                      className={`page-item ${pagination.page === blogPosts?.totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === blogPosts?.totalPages}
                      >
                        Next
                      </button>
                    </li>
                    <li
                      className={`page-item ${pagination.page === blogPosts?.totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(blogPosts?.totalPages || 1)}
                        disabled={pagination.page === blogPosts?.totalPages}
                      >
                        <IconifyIcon icon="bx:right-arrow-alt" />
                      </button>
                    </li>
                  </ul>
                </Col>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BlogPostList;