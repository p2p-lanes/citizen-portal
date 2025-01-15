import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SectionWrapper from "./SectionWrapper"
import { SectionProps } from "@/types/Section"
import CheckboxForm from "@/components/ui/Form/Checkbox"
import InputForm from "@/components/ui/Form/Input"
import TextAreaForm from "@/components/ui/Form/TextArea"
import { SectionSeparator } from "./section-separator"
import { useCityProvider } from "@/providers/cityProvider"
import { dynamicForm } from "@/constants"
import SelectForm from "@/components/ui/Form/Select"
import { paymentCapacityOptions } from "@/constants/Forms/edge-sa"


export function ScholarshipForm({ formData, errors, handleChange, fields }: SectionProps) {
  const [isInterested, setIsInterested] = useState(formData.scholarship_request || false)
  const { getCity } = useCityProvider()
  const city = getCity()

  const form = dynamicForm[city?.slug ?? '']

  const animationProps = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <>
      <SectionWrapper title={`${city?.name} scholarship`} subtitle={`Fill out this section if you are interested in securing one of a limited number of scholarships for ${city?.name}. We are prioritizing scholars who apply for the full experience (May 24 - June 21, 2025).`}>  

        {
          fields?.has('scholarship_request') && (
            <CheckboxForm
              label="Are you interested in applying for a scholarship?"
              id="scholarship_request"
              checked={isInterested}
              onCheckedChange={(checked) => {
                setIsInterested(checked === true)
                handleChange('scholarship_request', checked === true)
                if (checked === false) {
                  handleChange('scholarship_categories', [])
                  handleChange('scholarship_details', '')
                }
              }}
            />
          )
        }

        <AnimatePresence>
          {isInterested && (
            <motion.div {...animationProps}>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  {form?.scolarship_subtitle}
                </p>

                {
                  fields?.has('payment_capacity') && (
                    <SelectForm 
                      label="I can comfortably cover up to:"
                      id="payment_capacity"
                      value={formData.payment_capacity}
                      onChange={(value) => handleChange('payment_capacity', value)}
                      error={errors.payment_capacity}
                      options={paymentCapacityOptions}
                    />
                  )
                }
                
                {
                  fields?.has('scholarship_video_url') && (
                    <InputForm
                      isRequired
                      label="[Required] Please share a ~60 second video answering why you’re applying for a scholarship and what your contribution might be. If you are applying for a scholarship and want to receive a ticket discount, this video is mandatory."
                      id="scholarship_video_url"
                      value={formData.scholarship_video_url ?? ''}
                      onChange={(e) => handleChange('scholarship_video_url', e)}
                      error={errors.scholarship_video_url}
                      subtitle="You can upload your video to Dropbox, Google Drive, Youtube, or anywhere where you can make the link public and viewable"
                    />
                  )
                }

                {
                  fields?.has('scholarship_details') && (
                    <TextAreaForm
                      label="If you want to add any more detail in written form, you can use this textbox (you will still need to upload the video above, even if you fill this out)."
                      id="scholarship_details"
                      value={formData.scholarship_details ?? ''}
                      handleChange={(e) => handleChange('scholarship_details', e)}
                      error={errors.scholarship_details}
                    />
                  )
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionWrapper>
      <SectionSeparator />
    </>
  )
}

