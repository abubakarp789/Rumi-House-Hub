import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export default function Register() {
  const { register, user, authError, setAuthError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    role: 'student',
    department: 'Computer Science',
    batch: '2022',
    password: '',
    confirmPassword: ''
  });

  const [agreed, setAgreed] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'executive') navigate('/executive');
      else navigate('/dashboard');
    }
    setAuthError('');
  }, [user, navigate, setAuthError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required.';
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!formData.email.toLowerCase().endsWith('@namal.edu.pk')) {
      errors.email = 'Email must end with @namal.edu.pk student domain.';
    }

    if (!formData.registrationNumber.trim()) {
      errors.registrationNumber = 'Registration number is required.';
    } else if (!/^NUM-[A-Z]{3,4}-\d{4}-\d{1,3}$/i.test(formData.registrationNumber)) {
      errors.registrationNumber = 'Use format NUM-DEPT-YYYY-ID, e.g. NUM-BSCS-2222-41.';
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreed) {
      errors.agreed = 'You must confirm that these details are accurate.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Destructure confirmPassword and agree checkbox out for the backend payload
    const { confirmPassword, ...payload } = formData;

    try {
      setLoading(true);
      const registeredUser = await register(payload);

      if (registeredUser.role === 'admin') navigate('/admin');
      else if (registeredUser.role === 'executive') navigate('/executive');
      else navigate('/dashboard');
    } catch (err) {
      // Backend errors are handled by AuthContext.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-container-max w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-start mt-8 mb-12 animate-[page-enter_420ms_cubic-bezier(.16,1,.3,1)]">
      {/* Left Editorial Section: Context */}
      <div className="md:col-span-5 flex flex-col gap-8 md:sticky md:top-28">
        <div className="flex flex-col gap-4">
          <span className="font-label-uppercase text-label-uppercase text-secondary tracking-[0.2em]">Institutional Access</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface italic">
            The Scholars’ <br/>Registry
          </h1>
          <div className="h-1 w-24 bg-primary"></div>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          Welcome to the central academic hub. By registering, you gain access to the collective intelligence, society events, and financial tracking of the Rumi House ecosystem.
        </p>
        
        {/* Student Designation Notice */}
        <div className="bg-surface-container-low border-l-4 border-secondary p-6">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <div>
              <p className="font-label-uppercase text-label-uppercase text-on-surface mb-2 font-bold text-xs">Student Designation</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                New accounts are created as Student accounts. Society executives are assigned by Admin.
              </p>
            </div>
          </div>
        </div>
        
        {/* Academic Library Mockup Image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-outline-variant bg-white flex items-center justify-center p-8">
          <img 
            alt="Namal Logo" 
            className="max-h-[80%] max-w-[80%] object-contain grayscale-[0.3] opacity-80" 
            src={logoImg}
          />
        </div>
      </div>

      {/* Right Section: Registration Form */}
      <div className="md:col-span-7 bg-white border border-outline-variant p-8 md:p-12">
        {authError && (
          <div className="p-4 mb-6 bg-error-container text-on-error-container border border-error text-xs rounded" role="alert">
            {authError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-8" aria-label="Register Student Form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-name" className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                Full Name
              </label>
              <input 
                id="reg-name" 
                name="name" 
                type="text"
                className="border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-0" 
                placeholder="e.g. Jalal al-Din Rumi" 
                value={formData.name} 
                onChange={handleInputChange} 
                disabled={loading}
              />
              {validationErrors.name && <span className="text-error text-xs block mt-1 font-semibold">{validationErrors.name}</span>}
            </div>

            {/* University Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-email" className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                University Email
              </label>
              <input 
                id="reg-email" 
                name="email" 
                type="email"
                className="border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-0" 
                placeholder="username@namal.edu.pk" 
                value={formData.email} 
                onChange={handleInputChange} 
                disabled={loading}
              />
              {validationErrors.email && <span className="text-error text-xs block mt-1 font-semibold">{validationErrors.email}</span>}
            </div>

            {/* Registration Number */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-id" className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                Reg#
              </label>
              <input 
                id="reg-id" 
                name="registrationNumber" 
                type="text"
                className="border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-0" 
                placeholder="NUM-BSCS-2024-42" 
                value={formData.registrationNumber} 
                onChange={handleInputChange} 
                disabled={loading}
              />
              {validationErrors.registrationNumber && <span className="text-error text-xs block mt-1 font-semibold">{validationErrors.registrationNumber}</span>}
            </div>

            {/* Department */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-dept" className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                Department
              </label>
              <select 
                id="reg-dept" 
                name="department" 
                className="border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-0"
                value={formData.department} 
                onChange={handleInputChange} 
                disabled={loading}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Social Sciences">Social Sciences</option>
              </select>
            </div>

            {/* Batch */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-batch" className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                Batch
              </label>
              <input 
                id="reg-batch" 
                name="batch" 
                type="text"
                className="border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-0" 
                placeholder="2024" 
                value={formData.batch} 
                onChange={handleInputChange} 
                disabled={loading} 
              />
              {validationErrors.batch && <span className="text-error text-xs block mt-1 font-semibold">{validationErrors.batch}</span>}
            </div>

            {/* Empty Spacer column for desktop alignment */}
            <div className="hidden md:block"></div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-pw" className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <input 
                  id="reg-pw" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-0" 
                  placeholder="At least 6 chars" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  disabled={loading} 
                />
                <span 
                  className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant cursor-pointer select-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
              {validationErrors.password && <span className="text-error text-xs block mt-1 font-semibold">{validationErrors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-confirm-pw" className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  id="reg-confirm-pw" 
                  name="confirmPassword" 
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-0" 
                  placeholder="Re-enter password" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  disabled={loading} 
                />
                <span 
                  className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant cursor-pointer select-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
              {validationErrors.confirmPassword && <span className="text-error text-xs block mt-1 font-semibold">{validationErrors.confirmPassword}</span>}
            </div>

          </div>

          {/* Verification Checkbox */}
          <div className="flex items-start gap-3 py-2">
            <input 
              id="reg-confirm-checkbox" 
              type="checkbox" 
              checked={agreed} 
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (validationErrors.agreed) setValidationErrors(prev => ({ ...prev, agreed: '' }));
              }} 
              disabled={loading} 
              className="mt-1 w-5 h-5 border border-outline-variant text-primary rounded-sm focus:ring-primary focus:border-primary"
            />
            <label htmlFor="reg-confirm-checkbox" className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              I verify that all entered details (specifically batch, department, and university registration number) are correct and official, and I agree to abide by the Institutional Engagement Guidelines and Academic Integrity standards.
            </label>
          </div>
          {validationErrors.agreed && <span className="text-error text-xs block mt-1 font-semibold">{validationErrors.agreed}</span>}

          {/* Form Actions */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <button 
              className="w-full md:w-auto px-12 py-4 bg-primary text-on-primary font-label-uppercase text-label-uppercase hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  Processing...
                </>
              ) : (
                <>
                  Register Account
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
            <div className="flex gap-2 font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Already a member?</span>
              <Link className="text-primary font-bold hover:underline" to="/login">
                Log in here
              </Link>
            </div>
          </div>
        </form>

        {/* Bottom Metadata */}
        <div className="mt-12 pt-8 border-t border-outline-variant grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="font-label-uppercase text-[10px] text-on-surface-variant">Protocol</span>
            <span className="font-body-sm text-body-sm">HTTPS SECURE</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-uppercase text-[10px] text-on-surface-variant">Entity</span>
            <span className="font-body-sm text-body-sm">STUDENT</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-uppercase text-[10px] text-on-surface-variant">Authority</span>
            <span className="font-body-sm text-body-sm">REGISTRY</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-uppercase text-[10px] text-on-surface-variant">Status</span>
            <span className="font-body-sm text-body-sm text-primary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
