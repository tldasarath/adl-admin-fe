// src/pages/blogs/ProductSubmittedForm.jsx
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Col, Row, Button } from 'react-bootstrap';

const ProductSubmittedForm = ({ blogData, onSubmit }) => {
  return (
    <Row className="d-flex justify-content-center">
      <Col lg={8}>
        <div className="text-center">
          <IconifyIcon icon={'bx:check-double'} className="text-success h2" />
          <h3 className="mt-0">You're almost done!</h3>
          <h5 className="w-75 mb-2 mt-3 mx-auto text-muted">Review your blog details and press "Save Blog" to publish.</h5>

          <div className="text-start mb-3 mt-4">
            <strong>Title:</strong> {blogData.title || '—'}<br />
            <strong>Excerpt:</strong> {blogData.excerpt || '—'}<br />
            <strong>Images:</strong> {(blogData.images || []).length} selected<br />
            <strong>Meta Title:</strong> {blogData.metaTitle || '—'}
          </div>

          {/* <div className="d-flex justify-content-center gap-2">
            <Button variant="secondary" onClick={() => window.scrollTo(0, 0)}>Edit</Button>
            <Button variant="primary" onClick={onSubmit}>Save Blog</Button>
          </div> */}
        </div>
      </Col>
    </Row>
  );
};

export default ProductSubmittedForm;
