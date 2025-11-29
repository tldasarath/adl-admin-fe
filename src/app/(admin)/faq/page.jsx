// components/FAQManagement.tsx
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Row, 
  Col, 
  Button, 
  Table,
  Badge,
  Modal,
  Form,
  Alert,
  FormCheck
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { toast } from 'react-toastify';
import { createFaq, deletefaq, editFaq, editFaqOrder, editHomeFaq, getFaqs } from '@/api/apis';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setLoading(true);
    try {
      const response = await getFaqs();
      if(response.success){
        // Sort FAQs by order before setting state
        const sortedFaqs = response.data.sort((a, b) => a.order - b.order);
        setFaqs(sortedFaqs);
      }
    } catch (error) {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const getHomeSectionFAQsCount = () => {
    return faqs.filter(faq => faq.home).length;
  };

  const isHomeSectionLimitReached = () => {
    return getHomeSectionFAQsCount() >= 5;
  };

  const handleShowModal = (faq) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        isActive: faq.isActive
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: '',
        answer: '',
        isActive: true
      });
    }
    setShowModal(true);
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: ''
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleHomeSectionToggle = async (faq) => {
    if (!faq.home && isHomeSectionLimitReached()) {
      toast.error('Home section limit reached (max 5 FAQs)');
      return;
    }

    try {
      const updatedFaq = { ...faq, home: !faq.home };
      let response = await editHomeFaq(faq._id, { home: !faq.home });
      if(response.success){
        setFaqs(prev => prev.map(item => 
          item._id === faq._id ? updatedFaq : item
        ));
        toast.success(`FAQ ${updatedFaq.home ? 'added to' : 'removed from'} home section`);
      }
    } catch (error) {
      toast.error('Failed to update FAQ');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.trim().length < 10) {
      newErrors.question = 'Question must be at least 10 characters long';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    } else if (formData.answer.trim().length < 20) {
      newErrors.answer = 'Answer must be at least 20 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingFaq) {
        let response = await editFaq(editingFaq._id, formData);
        if(response.success){
          setFaqs(prev => prev.map(item => 
            item._id === editingFaq._id ? { ...editingFaq, ...formData } : item
          ));
          toast.success(response.message);
        }
      } else {
        if (faqs.length >= 8) {
          toast.error("FAQ limit reached. You can only have up to 8 FAQs.");
          return;
        }
        formData.order=faqs.length+1
        const response = await createFaq(formData);  
              
        if(response.success){
          const newFaq = {
            _id: response.data?._id || Date.now(),
            ...formData,
            home: false,
            order: faqs.length // Set initial order as last position
          };
          setFaqs(prev => [...prev, newFaq]);
          toast.success(response.message);
        }
      }
      
      handleCloseModal();
    } catch (error) {
      toast.error(`Failed to ${editingFaq ? 'update' : 'create'} FAQ`);
    }
  };

  const handleDeleteClick = (faq) => {
    setFaqToDelete(faq);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;

    try {
      const response = await deletefaq(faqToDelete._id);
      if(response.success){
        setFaqs(prev => prev.filter(item => item._id !== faqToDelete._id));
        toast.success(response.message);
        setShowDeleteModal(false);
        setFaqToDelete(null);
      }
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  // Handle drag and drop
const handleDragEnd = async (result) => {
  if (!result.destination) return;

  // Check if the position actually changed
  if (result.source.index === result.destination.index) return;

  // Reorder items locally
  const items = Array.from(faqs);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  // Update order numbers
  const updatedItems = items.map((item, index) => ({
    ...item,
    order: index + 1
  }));

  try {
    // Update backend for all items in parallel
    const updatePromises = updatedItems.map(item =>
      editFaqOrder(item._id, { order: item.order })
    );

    const results = await Promise.all(updatePromises);

    // Check if all updates succeeded
    const allSuccess = results.every(res => res.success);

    if (allSuccess) {
      // Update state only if all backend updates succeed
      setFaqs(updatedItems);
      toast.success('FAQ order updated successfully');
    } else {
      toast.error('Failed to update FAQ order for some items');
      loadFAQs(); // revert UI to backend state
    }
  } catch (error) {
    toast.error('Failed to update FAQ order');
    loadFAQs(); // revert UI
  }
};



  const homeSectionCount = getHomeSectionFAQsCount();
  const homeSectionLimitReached = isHomeSectionLimitReached();

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">FAQ Management</h4>
                  <div className="mt-2">
                    <Badge bg={homeSectionLimitReached ? 'warning' : 'success'}>
                      Home Section: {homeSectionCount}/5 FAQs
                    </Badge>
                    {homeSectionLimitReached && (
                      <small className="text-warning ms-2">
                        Home section limit reached - cannot add more FAQs to home section
                      </small>
                    )}
                  </div>
                     <div className="mt-3 text-muted">
                <small className='text-warning'>
                  <IconifyIcon icon="bx:info-circle" className="me-1" />
                  Drag and drop rows to reorder FAQs
                </small>
              </div>
                </div>
                <Button 
                  variant="success" 
                  onClick={() => handleShowModal()}
                >
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Add FAQ
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Question</th>
                      <th>Order</th>
                      <th>Home Section</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <Droppable droppableId="faqs">
                    {(provided, snapshot) => (
                      <tbody 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={snapshot.isDraggingOver ? 'drag-over' : ''}
                      >
                        {loading ? (
                          <tr>
                            <td colSpan={4} className="text-center">
                              <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </td>
                          </tr>
                        ) : faqs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center text-muted">
                              No FAQs found
                            </td>
                          </tr>
                        ) : (
                          faqs.map((faq, index) => (
                            <Draggable 
                              key={faq._id} 
                              draggableId={faq._id} 
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`
                                    ${snapshot.isDragging ? 'dragging' : ''}
                                    ${snapshot.isDragging ? 'table-active' : ''}
                                    drag-handle
                                  `}
                                  style={{
                                    ...provided.draggableProps.style,
                                    cursor: 'grab',
                                  }}
                                >
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className="me-2">{index + 1}</span>
                                   
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <strong>{faq.question}</strong>
                                      <br />
                                      <small className="text-muted">
                                        {faq.answer.substring(0, 100)}...
                                      </small>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='p-2'>
                                      <strong>{faq.order}</strong>
                                    
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <FormCheck
                                        type="switch"
                                        id={`home-section-${faq._id}`}
                                        checked={faq.home}
                                        onChange={() => handleHomeSectionToggle(faq)}
                                        disabled={!faq.home && homeSectionLimitReached}
                                      />
                                      <Badge 
                                        bg={faq.home ? 'success' : 'secondary'} 
                                        className="ms-2"
                                      >
                                        {faq.home ? 'Enabled' : 'Disabled'}
                                      </Badge>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => handleShowModal(faq)}
                                      >
                                        <IconifyIcon icon="bx:edit" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => handleDeleteClick(faq)}
                                      >
                                        <IconifyIcon icon="bx:trash" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </Table>
              </DragDropContext>

           
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit FAQ Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <IconifyIcon icon={editingFaq ? "bx:edit" : "bx:plus"} className="me-2" />
            {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Question *</Form.Label>
                  <Form.Control
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Enter the question (minimum 10 characters)"
                    isInvalid={!!errors.question}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.question}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Minimum 10 characters required
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Answer *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    placeholder="Enter the answer (minimum 20 characters)"
                    isInvalid={!!errors.answer}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.answer}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Minimum 20 characters required
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <IconifyIcon icon={editingFaq ? "bx:edit" : "bx:plus"} className="me-1" />
              {editingFaq ? 'Update FAQ' : 'Add FAQ'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the FAQ: 
          <strong> "{faqToDelete?.question}"</strong>?
          <br />
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <IconifyIcon icon="bx:trash" className="me-1" />
            Delete FAQ
          </Button>
        </Modal.Footer>
      </Modal>

      
    </>
  );
};

export default FAQManagement;