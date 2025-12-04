import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { Col, Row, Card, Button } from 'react-bootstrap';
import { forwardRef, useState, useEffect } from 'react';
import { getSeo, saveSeo } from '@/api/apis';
import { toast } from 'react-toastify';

// =============================
// PAGE + INNER PAGE LIST
// =============================
const PAGE_OPTIONS = {
  home: [],
  about: [],
  services: [
    "Service Page",
    "Company Formation",
    "Golden Visa",
    "PRO Services",
    "Local Sponsorship",
    "Visa Services",
    "ISO Certification & Trademark Registration",
    "Virtual Office",
    "Company Liquidation",
    "Document Attestation",
    "Legal Translation",
    "Insurance & VAT Services",
    "Bank Account Opening",
    "Typing Services",
    "UAE Government Approvals",
    "Medical & Emirates ID Services",
    "FREEZONE",
    "Dubai Court Services",
    "Online MOA & POA Services"
  ],
  freezone: [
    "Ifza Freezone Dubai",
    "Jafza Freezone Dubai",
    "Meydan Freezone Dubai",
    "Dubai South Freezone",
    "Dafza Freezone Dubai",
    "Dubai Media Internet D3 Difc",
    "Adgm Abu Dhabi",
    "Kizad Abu Dhabi",
    "Masdar City Freezone Abu Dhabi",
    "Twofour54 Abu Dhabi",
    "Saif Zone Sharjah",
    "Hamriyah Free Zone Sharjah",
    "Shams Sharjah",
    "Spcfz Sharjah Publishing City",
    "Rakez Ras Al Khaimah",
    "Rak Maritime City",
    "Afz Ajman",
    "Ajman Media City",
    "Fujairah Free Zone",
    "Fujairah Creative City",
    "Uaq Free Trade Zone"
  ],
  mainland: [],
  visa: [
    "Employment Visa",
    "Investor Visa",
    "Family Visa",
    "Golden Visa",
    "Freelance Visa",
    "Green Visa",
    "Blue Visa"
  ],
  license: [
    "Commercial License",
    "Professional License",
    "Industrial License",
    "Tourism License",
    "E-Trader License",
    "Freelance Permit"
  ],
  gallery: [],
  blog: [],
  contact: [],
};

// =============================
// VALIDATION SCHEMA
// =============================
const metaDataFormSchema = yup.object({
  page: yup.string().required("Please select a page"),
  innerPage: yup.string().when("page", {
    is: (page) => PAGE_OPTIONS[page]?.length > 0,
    then: (schema) => schema.required("Please select an inner page"),
    otherwise: (schema) => schema.notRequired(),
  }),
  title: yup.string().required('Meta title is required'),
  keywords: yup.string().required("At least 1 keyword is required"),
  description: yup.string().required('Meta description is required'),
  canonical: yup.string().url('Please enter a valid URL').required("Canonical URL is required"),
});

// =============================
// MAIN COMPONENT
// =============================
const SeoLayout = forwardRef((props, ref) => {

  const [innerPages, setInnerPages] = useState([]);
  const [keywordList, setKeywordList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(metaDataFormSchema),
    mode: "onChange",
    defaultValues: {
      page: "home",
      innerPage: "",
      title: "",
      keywords: "",
      description: "",
      canonical: "",
    },
  });

  const selectedPage = watch("page");
  const selectedInnerPage = watch("innerPage");

  // Load inner pages for default page
  useEffect(() => {
    setInnerPages(PAGE_OPTIONS["home"]);
  }, []);

  // Add keywords
  const addKeywords = (value) => {
    const keywords = value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    setKeywordList(keywords);
  };

  // Remove keyword
  const removeKeyword = (kw) => {
    const updated = keywordList.filter((k) => k !== kw);
    setKeywordList(updated);
    setValue("keywords", updated.join(", "));
  };

  // Clear all SEO fields
  const clearSeoFields = () => {
    setValue("title", "");
    setValue("keywords", "");
    setValue("description", "");
    setValue("canonical", "");
    setKeywordList([]);
  };

  // Page selection handler
  const handlePageChange = (e) => {
    const page = e.target.value;

    setValue("page", page);
    setInnerPages(PAGE_OPTIONS[page] || []);

    setValue("innerPage", "");
    clearSeoFields();
  };

  // Inner Page selection handler
  const handleInnerPageChange = (e) => {
    const inner = e.target.value;

    setValue("innerPage", inner);
    clearSeoFields();
  };

  // Load SEO when page / innerPage changes
  useEffect(() => {
    if (!selectedPage) return;

    const loadSeo = async () => {
      try {
        const res = await getSeo(selectedPage, selectedInnerPage);

        if (res?.success) {
          const seo = res.data;

          setValue("title", seo.title);
          setValue("keywords", seo.keywords.join(", "));
          setValue("description", seo.description);
          setValue("canonical", seo.canonical);
          setKeywordList(seo.keywords);
        }
      } catch {
        console.log("No SEO found for this page/subpage");
      }
    };

    loadSeo();
  }, [selectedPage, selectedInnerPage]);

  // SUBMIT
  const onSubmit = async (data) => {
    try {
      setIsSaving(true);

      const formattedData = {
        ...data,
        keywords: data.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      };

      const res = await saveSeo(formattedData);

      if (res) {
        toast.success(res.message);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* PAGE SELECTION */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Page Selection</h5>

          <Row>
            <Col md={6}>
              <label className="form-label fw-bold">Select Page</label>
              <select
                className={`form-select ${errors.page ? "is-invalid" : ""}`}
                {...register("page")}
                onChange={handlePageChange}
              >
                <option value="">Select Page</option>
                {Object.keys(PAGE_OPTIONS).map((page) => (
                  <option key={page} value={page}>
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </option>
                ))}
              </select>
              {errors.page && <p className="text-danger small">{errors.page.message}</p>}
            </Col>

            <Col md={6}>
              <label className="form-label fw-bold">Inner Page</label>
              <select
                className={`form-select ${errors.innerPage ? "is-invalid" : ""}`}
                {...register("innerPage")}
                disabled={innerPages.length === 0}
                onChange={handleInnerPageChange}
              >
                <option value="">Select Inner Page</option>
                {innerPages.map((inner, i) => (
                  <option key={i} value={inner}>{inner}</option>
                ))}
              </select>
              {errors.innerPage && <p className="text-danger small">{errors.innerPage.message}</p>}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* SEO FIELDS */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">SEO Meta Information</h5>

          <Row>
            <Col md={6}>
              <TextFormInput
                control={control}
                name="title"
                label="Meta Title"
                placeholder="Enter Meta Title"
              />
            </Col>

            <Col md={6}>
              <label className="form-label">Meta Keywords</label>
              <input
                type="text"
                className={`form-control ${errors.keywords ? "is-invalid" : ""}`}
                placeholder="keyword1, keyword2"
                {...register("keywords")}
                onChange={(e) => {
                  setValue("keywords", e.target.value);
                  addKeywords(e.target.value);
                }}
              />

              {/* KEYWORD TAGS */}
              <div className="d-flex gap-2 flex-wrap mt-2">
                {keywordList.map((kw, i) => (
                  <span
                    key={i}
                    className="badge bg-primary"
                    style={{ fontSize: "14px", padding: "8px 12px", borderRadius: "8px" }}
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => removeKeyword(kw)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        marginLeft: "5px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {errors.keywords && <p className="text-danger small">{errors.keywords.message}</p>}
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <TextFormInput
                control={control}
                name="canonical"
                label="Canonical URL"
                placeholder="https://example.com/page"
              />
            </Col>
          </Row>

          <TextAreaFormInput
            control={control}
            name="description"
            label="Meta Description"
            placeholder="Enter SEO Meta Description"
            containerClassName="mt-3"
          />

        </Card.Body>
      </Card>

      {/* SUBMIT BUTTON */}
      <div className="d-flex justify-content-end mt-3">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save SEO Data"}
        </Button>
      </div>

    </form>
  );
});

export default SeoLayout;
