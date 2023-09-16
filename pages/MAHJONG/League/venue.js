function generateSurveyHTML(month, year, endDate, chineseMonth, times=16) {
  return `
    <span class="survey-country list-only">
      ${month.toUpperCase()}
    </span>
    
    <span class="survey-name">
      ${year} 林間盃 ${chineseMonth}月份 日麻積分賽
    </span>
    
    <span class="survey-country grid-only">
      ${month.toUpperCase()}
    </span>
  
    <div class="pull-right">
      <span class="survey-progress">
        <span class="survey-progress-bg">
          <span class="survey-progress-fg" style="width: 100%;"></span>
        </span>
        
        <span class="survey-progress-labels">
          <span class="survey-progress-label">
            100%
          </span>

          <span class="survey-completes">
            ${times} / ${times}
          </span>
        </span>
      </span>
      
      <span class="survey-end-date">
        ${year} - ${month} ${endDate}
      </span>
      
      <span class="survey-stage">
        <span class="stage draft">Draft</span>
        <span class="stage awarded">Awarded</span>
        <span class="stage live">Live</span>
        <span class="stage ended active">Ended</span>        
      </span>
    </div>
  `;
}

document.getElementById('Jan2022').innerHTML = generateSurveyHTML('Jan', 2022, 23, '一', 24);
document.getElementById('Feb2022').innerHTML = generateSurveyHTML('Feb', 2022, '二', 23);
document.getElementById('Mar2022').innerHTML = generateSurveyHTML('Mar', 2022, '三', 30);
document.getElementById('Apr2022').innerHTML = generateSurveyHTML('Apr', 2022, '四', 27);
document.getElementById('May2022').innerHTML = generateSurveyHTML('May', 2022, '五', 25);
document.getElementById('Jun2022').innerHTML = generateSurveyHTML('Jun', 2022, '六', 29);
document.getElementById('Jul2022').innerHTML = generateSurveyHTML('Jul', 2022, '七', 27);
document.getElementById('Aug2022').innerHTML = generateSurveyHTML('Aug', 2022, '八', 31);
document.getElementById('Sep2022').innerHTML = generateSurveyHTML('Sep', 2022, '九', 28);
document.getElementById('Nov2022').innerHTML = generateSurveyHTML('Nov', 2022, '十一', 30);
document.getElementById('Dec2022').innerHTML = generateSurveyHTML('Dec', 2022, '十二', 30, 12);
document.getElementById('Jan2023').innerHTML = generateSurveyHTML('Jan', 2023, '一', 25);
document.getElementById('Feb2023').innerHTML = generateSurveyHTML('Feb', 2023, '二', 22);
document.getElementById('Mar2023').innerHTML = generateSurveyHTML('Mar', 2023, '三', 29);
document.getElementById('Apr2023').innerHTML = generateSurveyHTML('Apr', 2023, '四', 26);
document.getElementById('May2023').innerHTML = generateSurveyHTML('May', 2023, '五', 31);
document.getElementById('Jun2023').innerHTML = generateSurveyHTML('Jun', 2023, '六', 28);
document.getElementById('Jul2023').innerHTML = generateSurveyHTML('Jul', 2023, '七', 26);
document.getElementById('Aug2023').innerHTML = generateSurveyHTML('Aug', 2023, '八', 30);