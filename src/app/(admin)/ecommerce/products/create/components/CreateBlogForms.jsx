// src/pages/blogs/CreateBlogForms.jsx
import clsx from 'clsx';
import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import GeneralDetailsForm from './GeneralDetailsForm';
import MetaDataForm from './MetaDataForm';
import ProductGalleryForm from './ProductGalleryForm';
import ProductSubmittedForm from './ProductSubmittedForm';
import { useNavigate } from 'react-router-dom';
import { addBlog } from '@/api/apis';
import { toast } from 'react-toastify';

const formSteps = [
  { index: 1, name: 'Blog Detail', icon: 'bxs:contact', tab: <GeneralDetailsForm /> },
  { index: 2, name: 'Blog Image', icon: 'bx:images', tab: <ProductGalleryForm /> },
  { index: 3, name: 'Meta Data', icon: 'bxs:book', tab: <MetaDataForm /> },
  { index: 4, name: 'Finish', icon: 'bxs:check-circle', tab: <ProductSubmittedForm /> }
];

const CreateBlogForms = ({ handleBlog }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFormValid = () => {
    return (
      blogData.title.trim() &&
      blogData.excerpt.trim() &&
      blogData.description.trim() &&
      blogData.image &&
      blogData.metaTitle.trim() &&
      blogData.metaKeywords.trim() &&
      blogData.metaDescription.trim()
    );
  };

  // centralized blog data
  const [blogData, setBlogData] = useState({
    title: '',
    excerpt: '',
    description: '',
    image: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: ''
  });

  const navigate = useNavigate();

  const updateBlogData = (patch) => {
    setBlogData(prev => ({ ...prev, ...patch }));
  };

  // submit to backend
  const handleSubmitBlog = async () => {

    // block submission if not valid
    if (!isFormValid()) {
      toast.error("Please fill all required fields before submitting.", {
        position: "top-right"
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("excerpt", blogData.excerpt);
      formData.append("description", blogData.description);
      formData.append("metaTitle", blogData.metaTitle);
      formData.append("metaKeywords", blogData.metaKeywords);
      formData.append("metaDescription", blogData.metaDescription);

      if (blogData.image) {
        formData.append("image", blogData.image, blogData.image.name);
      }

      const res = await addBlog(formData);

      if (res.success) {
        toast.success("Blog added successfully!");
       navigate("/blogs")
      }

    } catch (err) {
      toast.error("Error saving blog. Try again!");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Tabs
        variant="underline"
        activeKey={activeStep}
        className="nav nav-tabs card-tabs"
        onSelect={e => setActiveStep(Number(e))}
      >
        {formSteps.map(step => (
          <Tab
            key={step.index}
            eventKey={step.index}
            className="nav-item"
            tabClassName="pb-3"
            title={
              <span className="fw-semibold">
                <IconifyIcon icon={step.icon} className="me-1" />
                <span className="d-none d-sm-inline">{step.name}</span>
              </span>
            }
          >
            {React.cloneElement(step.tab, { updateBlogData, blogData })}
          </Tab>
        ))}
      </Tabs>

      <div className="d-flex flex-wrap gap-2 wizard justify-content-between mt-3">
        <div className="previous me-2">
          <button
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            className="btn btn-primary"
            disabled={activeStep === 1 || isSubmitting}
          >
            <IconifyIcon icon="bx:left-arrow-alt" className="me-2" />
            Back To Previous
          </button>

        </div>
        <div className="next">
          {activeStep < formSteps.length ? (
            <button
              onClick={() => setActiveStep(prev => Math.min(formSteps.length, prev + 1))}
              className={clsx('btn btn-primary', { disabled: formSteps.length === activeStep })}
            >
              Next Step
              <IconifyIcon icon="bx:right-arrow-alt" className="ms-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmitBlog}
              className="btn btn-success"
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? "Saving..." : "Submit Blog"}
            </button>

          )}
        </div>
      </div>
    </>
  );
};

export default CreateBlogForms;
