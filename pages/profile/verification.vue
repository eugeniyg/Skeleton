<template>
  <div class="verification">
    <div class="verification__title">Verification</div>
    
    <div class="verification__sub-title">Phone & Email Verification</div>
    
    <div class="verification__cards">
      <div class="verification__card">
        <div class="verification__card-title">Phone number Verification</div>
        
        <div class="verification__card-form">
          <div class="verification__info">
            <span class="verification__info-value">+1976783****45</span>
            <atomic-icon id="done"/>
            <atomic-icon id="warning"/>
            <div class="verification__info-close">
              <atomic-icon id="close"/>
            </div>
          </div>
          
          <form-input-text label="Verification code" placeholder="Enter SMS code"/>
          
          <form-input-phone/>
          
          <div class="verification__card-actions">
            <button-base type="primary" size="sm">Add phone</button-base>
            <button-resend/>
          </div>
        </div>
      
      </div>
      
      <div class="verification__card">
        <div class="verification__card-title">Email Verification</div>
        
        <div class="verification__card-form">
          <div class="verification__info">
            <span class="verification__info-value">name@mailserver.com</span>
            <atomic-icon id="done"/>
            <atomic-icon id="warning"/>
            <div class="verification__info-close">
              <atomic-icon id="close"/>
            </div>
          </div>
          <div class="verification__info-hint">
            Please, contact support to verify <br/> your phone number
          </div>
          
          
          <div class="verification__card-actions">
            <button-base type="primary" size="sm">Resend Email</button-base>
          </div>
        
        </div>
      </div>
    </div>
  </div>
</template>

<style src="~/assets/styles/components/profile/verification.scss" lang="scss"/>