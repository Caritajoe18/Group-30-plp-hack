import { useState } from 'react'
import './ReportIncident.css'

interface FormErrors {
  description?: string
  location?: string
  evidence?: string
  general?: string
}

function ReportIncident() {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    anonymous: false,
    evidence: null as File | null
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handlePanic = () => {
    window.location.href = '/calculator'
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (formData.evidence) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime']
      if (!allowedTypes.includes(formData.evidence.type)) {
        newErrors.evidence = 'Please select a valid image or video file'
      } else if (formData.evidence.size > 10 * 1024 * 1024) { // 10MB
        newErrors.evidence = 'File size must be less than 10MB'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null
      setFormData(prev => ({ ...prev, [name]: file }))
      // Clear evidence error when user selects a file
      if (errors.evidence) {
        setErrors(prev => ({ ...prev, evidence: undefined }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      // Clear field error when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // TODO: Submit to backend
      console.log('Form submitted:', formData)

      setSubmitSuccess(true)
      setFormData({
        description: '',
        location: '',
        anonymous: false,
        evidence: null
      })

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      setErrors({ general: 'Failed to submit report. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="report-incident">
      <header className="header">
        <h1>Report Incident</h1>
        <p>Please provide details of the incident. Your report is confidential.</p>
      </header>
      <main className="main">
        {submitSuccess && (
          <div className="success-message">
            ✅ Report submitted successfully! Your information has been securely recorded.
          </div>
        )}

        {errors.general && (
          <div className="error-message">
            ❌ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="description">Description of Incident *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              placeholder="Describe what happened in detail..."
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
            <small className="field-help">Minimum 10 characters required</small>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
              placeholder="Where did it happen?"
            />
            {errors.location && <span className="field-error">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="evidence">Evidence (optional)</label>
            <input
              type="file"
              id="evidence"
              name="evidence"
              onChange={handleChange}
              accept="image/*,video/*"
              className={errors.evidence ? 'error' : ''}
            />
            {errors.evidence && <span className="field-error">{errors.evidence}</span>}
            <small className="field-help">Supported formats: JPG, PNG, GIF, MP4, MOV (max 10MB)</small>
            {formData.evidence && (
              <small className="file-info">
                Selected: {formData.evidence.name} ({(formData.evidence.size / 1024 / 1024).toFixed(2)} MB)
              </small>
            )}
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="anonymous"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
            />
            <label htmlFor="anonymous">Report anonymously</label>
            <small className="field-help">Your identity will be protected</small>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </main>
      <button className="panic-btn" onClick={handlePanic} aria-label="Quick Exit">⚠️</button>
    </div>
  )
}

export default ReportIncident