import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import { getCalculatedPrice } from '@/helpers/product';
import { getStockStatus } from '@/utils/other';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const ProductDetailView = ({
  product
}) => {
  const {
    title,
    excerpt,
    description
  
  } = product;
   const navigate =useNavigate() 
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};
  return <div className="ps-xl-3 mt-3 mt-xl-0">
      <h4 className="mb-3">{title}</h4>
      {/* <p className="text-muted gap-1 d-flex float-start me-3">
        {Array.from(new Array(Math.floor(review.stars))).map((_val, idx) => <IconifyIcon icon="fa6-solid:star" width={14} height={14} key={idx} className="text-base text-warning" />)}
        {!Number.isInteger(review.stars) && <IconifyIcon icon="fa6-solid:star-half-stroke" width={14} height={14} className="text-warning" />}
        {review.stars < 5 && Array.from(new Array(5 - Math.ceil(review.stars))).map((_val, idx) => <IconifyIcon icon="fa6-solid:star" key={idx} width={14} height={14} className="text-warning" />)}
      </p> */}
      {/* <p className="mb-3">
        {' '}
        <span className="text-muted">( {review.count} Customer Reviews )</span>
      </p> */}
      {/* <h4 className="mb-3">
        Price :{' '}
        <span className="text-muted me-2">
          <del>{currency + price}</del>
        </span>{' '}
        <b>{currency + getCalculatedPrice(product)}</b>
      </h4>
      <h4>
        <span className={`badge badge-soft-${stockStatus.variant} mb-3`}>{stockStatus.text}</span>
      </h4> */}
      {/* <form className="d-flex flex-wrap align-items-center mb-3">
        <label className="my-1 me-2" htmlFor="color">
          Color:
        </label>
        <div className="me-3">
          <select className="form-select form-select-sm my-1" id="color">
            <option value={1}>Black </option>
            <option value={2}>Blue </option>
            <option value={3}>Midnight </option>
          </select>
        </div>
        <label className="my-1 me-2" htmlFor="sizeinput">
          Size:
        </label>
        <div className="me-sm-3">
          <select className="form-select form-select-sm my-1" id="sizeinput">
            <option defaultChecked>256 GB</option>
            <option value={1}>512 GB</option>
          </select>
        </div>
      </form> */}
      {/* <div className="mb-3 pb-3 border-bottom">
        <h5>
          Processor Brand : <span className="text-muted me-2" /> <b>Apple</b>
        </h5>
        <h5>
          Processor Name : <span className="text-muted me-2" /> <b>M1</b>
        </h5>
        <h5>
          SSD : <span className="text-muted me-2" /> <b>Yes</b>
        </h5>
        <h5>
          SSD Capacity : <span className="text-muted me-2" /> <b>256 GB</b>
        </h5>
        <h5>
          RAM : <span className="text-muted me-2" /> <b>8 GB</b>
        </h5>
      </div> */}
      <div className="mb-3 flex-column d-flex">
        {/* <h5>About this item:</h5> */}
        <p className="text-muted mb-1 icons-center">
         {excerpt}
        </p>
       <p className="text-muted mb-1 icons-center">
  {stripHtml(description)}
</p>
        
       
       
      
       
      </div>
      <div className="d-flex gap-1">
        <Button onClick={()=>navigate("/blogs")} variant="danger" type="button" className="me-2">
          <IconifyIcon icon="bx:x" className="fs-18" />
          Close
        </Button>
        {/* <Button variant="primary" type="button">
          <IconifyIcon icon="bx:cart" className="fs-18 me-2" />
          Add to cart
        </Button> */}
      </div>
    </div>;
};
export default ProductDetailView;