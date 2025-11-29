// src/pages/blogs/GeneralDetailsForm.jsx
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { Col, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const generalFormSchema = yup.object({
  name: yup.string().required(),
  reference: yup.string().optional(),
  description: yup.string().optional()
});

const GeneralDetailsForm = ({ updateBlogData, blogData }) => {
  const [productDescriptionContent, setProductDescriptionContent] = useState(blogData.description || `<h2>Describe your blog...</h2>`);

  const { control, register, handleSubmit, setValue } = useForm({
    resolver: yupResolver(generalFormSchema),
    defaultValues: {
      name: blogData.title || '',
      reference: blogData.excerpt || '',
      description: blogData.description || ''
    }
  });

  // sync quill with centralized blog data whenever changes happen
  useEffect(() => {
    updateBlogData({
      description: productDescriptionContent
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDescriptionContent]);

  // also sync title/excerpt as user types (immediate)
  useEffect(() => {
    // register change handlers
    setValue('name', blogData.title || '');
    setValue('reference', blogData.excerpt || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onBlur={handleSubmit((vals) => {
      updateBlogData({
        title: vals.name,
        excerpt: vals.reference
      });
    })}>
      <Row>
        <Col lg={6}>
          <TextFormInput
            control={control}
            label="Blog Title"
            placeholder="Enter blog title"
            containerClassName="mb-3"
            id="blog-title"
            name="name"
          />
        </Col>
        <Col lg={6}>
          <TextFormInput
            control={control}
            name="reference"
            placeholder="Enter excerpt"
            label="Excerpt"
            containerClassName="mb-3"
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <div className="mb-5">
            <label className="form-label">Blog Description</label>
            <ReactQuill
              theme="snow"
              style={{ height: 195 }}
              className="pb-sm-3 pb-5 pb-xl-0"
              modules={{
                toolbar: [
                  [{ font: [] }, { size: [] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ color: [] }, { background: [] }],
                  [{ script: 'super' }, { script: 'sub' }],
                  [{ header: [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'],
                  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                  ['direction', { align: [] }],
                  ['link', 'image', 'video'],
                  ['clean']
                ]
              }}
              value={productDescriptionContent}
              onChange={(val) => {
                setProductDescriptionContent(val);
                updateBlogData({ description: val });
              }}
            />
          </div>
        </Col>
      </Row>
    </form>
  );
};

export default GeneralDetailsForm;
