import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { getBlogs } from "@/api/apis";
const EcommerceProductCreate = lazy(() => import('@/app/(admin)/ecommerce/products/create/page'));


// ---------------------
// Dummy Blog Data
// ---------------------



// ---------------------
// Blog Card Component
// ---------------------
const BlogCard = ({ post, onDelete, onEdit,onView }) => {
  const { title, image, excerpt, author, date, slug } = post;

  return (
    <Card className="h-100">
      <CardBody>
        <div className="text-center">

          {/* Thumbnail */}
          <img
            src={image}
            alt={title}
            className="img-fluid rounded mb-3"
            style={{ height: 180, objectFit: "cover", width: "100%" }}
          />

          {/* Title */}
          <h4 className="fs-18 mt-2 text-dark">{title}</h4>

          {/* Author + date */}
          <div className="text-muted small mb-2">
            <IconifyIcon icon="mdi:account" className="me-1" />
            {author}
            {" • "}
            <IconifyIcon icon="mdi:calendar" className="me-1" />
            {date}
          </div>

          {/* Excerpt */}
          <p className="text-muted" style={{ minHeight: 60 }}>
            {excerpt}
          </p>

          {/* ⭐ Learn More Button */}

          {/* Edit + Delete Buttons */}
          <div className="d-flex justify-content-center gap-2 mt-2">
            <Button
              variant="soft-primary"
              size="sm"
              onClick={() => onView(post)}
            >
              <IconifyIcon icon="mdi:eye-outline" className="fs-18" />
            </Button>

            <Button
              variant="soft-primary"
              size="sm"
              onClick={() => onEdit(post)}
            >
              <IconifyIcon icon="bx:edit" className="fs-18" />
            </Button>

            <Button
              variant="soft-danger"
              size="sm"
              onClick={() => onDelete(post)}
            >
              <IconifyIcon icon="bx:trash" className="fs-18" />
            </Button>
          </div>

        </div>
      </CardBody>
    </Card>
  );
};



// ---------------------
// Blog List Page
// ---------------------
const Blogs = () => {
  const [blogData, setBlogData] = useState([]);
  const [addBlog, setAddBlog] = useState(false)
  const [blogView, setBlogView] = useState(false)
  const navigate = useNavigate();
  const handleBlog = () => {
    setAddBlog(!addBlog)
  }
  useEffect(() => {
    const fetchBlog = async () => {
      const response = await getBlogs();

      if (response.success) {
        setBlogData(response.data); // ← use fetched data
      }
    };

    fetchBlog();
  }, [addBlog]);


  const handleDeleteClick = (post) => {
    setBlogData((prev) => prev.filter((item) => item.slug !== post.slug));
  };

  const handleEditClick = (post) => {
  navigate("/blogs/add-blog", { state: { blog: post } });
};

  const handleViewBlog = (blog) => {
    navigate(`/blogs/details/${blog._id}`)
    
  }
  return (
    <>
      {/* Header with Add Blog button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <PageBreadcrumb subName="Pages" title="Blog" />

       <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/blogs/add-blog")}
        >
          <IconifyIcon icon="bx:plus" className="me-1" /> Add Blog
        </Button>
      </div>

      <PageMetaData title="Blog" />

       <Row className="row-cols-1 row-cols-md-2 row-cols-xl-4 gx-3">
        {blogData?.map((post, idx) => (
          <Col key={idx} className="mb-3">
            <BlogCard
              post={post}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
              onView={handleViewBlog}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Blogs;
