// src/pages/blogs/MetaDataForm.jsx
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { Col, Row } from 'react-bootstrap';

const metaDataFormSchema = yup.object({
  title: yup.string().required(),
  keywords: yup.string().required(),
  description: yup.string().required()
});

const MetaDataForm = ({ updateBlogData, blogData }) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(metaDataFormSchema),
    defaultValues: {
      title: blogData.metaTitle || '',
      keywords: blogData.metaKeywords || '',
      description: blogData.metaDescription || ''
    }
  });

  return (
    <form onBlur={handleSubmit((vals) => {
      updateBlogData({
        metaTitle: vals.title,
        metaKeywords: vals.keywords,
        metaDescription: vals.description
      });
    })}>
      <h5 className="mb-3 mt-0">Fill all metadata below</h5>
      <Row>
        <Col md={6}>
          <TextFormInput control={control} name="title" containerClassName="mb-3" label="Meta Title" placeholder="Enter Meta Title" />
        </Col>
        <Col md={6}>
          <TextFormInput control={control} name="keywords" containerClassName="mb-3" label="Meta Keywords" placeholder="Enter Meta Keywords" />
        </Col>
      </Row>

      <TextAreaFormInput control={control} name="description" label="Meta Description" containerClassName="mb-3" placeholder="Enter Meta Description" />
    </form>
  );
};

export default MetaDataForm;
