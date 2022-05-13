

function apiRequest(reqObj) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log('status ' + this.status);
        if (this.readyState == 4 && (this.status == 200 || this.status == 201)) {
            reqObj.onSuccess(this);
            //this.responseText;
        }
    };

    var data = '';
    if (reqObj.hasOwnProperty('data')) {
        for (const key in reqObj.data) {
            data += `${key}=${reqObj.data[key]}&`;
        }
        console.log(data);
        if (reqObj.method == 'GET' || reqObj.method == 'get') {
            reqObj.url = reqObj.url + '?' + data.slice(0, -1);
            data = '';
        }
        else {
            data = data.slice(0, -1);
        }
    }
    xhttp.open(reqObj.method, reqObj.url, (reqObj.hasOwnProperty('async') ? reqObj.async : true));
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}

function toggle_custom_modal(modalId) {
    var modal_container = document.getElementById(modalId)
    var modal_checkbox = modal_container.querySelector('#custom-modal-checkbox');
    if (modal_checkbox.checked == 1) {
        modal_checkbox.checked = 0;
    }
    else {
        modal_container.querySelector('.custom-modal').style.top = `${getScroll()[1] + 10}px`;
        modal_checkbox.checked = 1;
    }
}

function generate_custom_modal(modalId, DataObject) {
    var containerEle = document.createElement('div');
    containerEle.setAttribute('id', modalId);
    containerEle.setAttribute('class', "custom-modal-container");

    if (!DataObject) {
        DataObject = {};
    }
    DataObject.size = DataObject.hasOwnProperty('size') ? DataObject.size : "small"
    var modal_html = `
                <input type="checkbox" id="custom-modal-checkbox">
            <label class="custom-modal-background"></label>
            <div class="custom-modal ${DataObject.size}-size-modal" style="top:${getScroll()[1] + 10}px">
                <div class="custom-modal-header">
                    <h3 class="custom-modal-title">${DataObject.title}</h3>
                    <label class="custom-modal-close">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAdVBMVEUAAABNTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU0N3NIOAAAAJnRSTlMAAQIDBAUGBwgRFRYZGiEjQ3l7hYaqtLm8vsDFx87a4uvv8fP1+bbY9ZEAAAB8SURBVBhXXY5LFoJAAMOCIP4VBRXEv5j7H9HFDOizu2TRFljedgCQHeocWHVaAWStXnKyl2oVWI+kd1XLvFV1D7Ng3qrWKYMZ+MdEhk3gbhw59KvlH0eTnf2mgiRwvQ7NW6aqNmncukKhnvo/zzlQ2PR/HgsAJkncH6XwAcr0FUY5BVeFAAAAAElFTkSuQmCC" width="16" height="16" alt="">
                    </label>
                </div>
                <div class="custom-modal-body">${DataObject.body}</div>
            </div>	
    
            `;
    containerEle.innerHTML = modal_html;
    document.body.appendChild(containerEle);

    var modal_container = document.getElementById(modalId)
    var modal_close = modal_container.querySelector('.custom-modal-close');
    var modal_sahdow = modal_container.querySelector('.custom-modal-background');
    modal_close.addEventListener("click", () => toggle_custom_modal(modalId));
    modal_sahdow.addEventListener("click", () => toggle_custom_modal(modalId));

    return {
        "title": DataObject.title,
        "body": DataObject.body,
        "size": DataObject.size,
        "update_title": (title) => { modal_container.querySelector('.custom-modal-title').innerHTML = title },
        "update_body": (body) => { modal_container.querySelector('.custom-modal-body').innerHTML = body },
        "update_size": (size) => {
            modal_container.querySelector('.custom-modal').classList.remove('small-size-modal');
            modal_container.querySelector('.custom-modal').classList.remove('medium-size-modal');
            modal_container.querySelector('.custom-modal').classList.remove('large-size-modal');
            modal_container.querySelector('.custom-modal').classList.add(`${size}-size-modal`);
        },
        "getBodyObject": () => { return modal_container.querySelector('.custom-modal-body') },
    };

}


function getScroll() {
    if (window.pageYOffset != undefined) {
        return [pageXOffset, pageYOffset];
    }
    else {
        var sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sx, sy];
    }
}



function paging(currentPage = 1, total_pages = 0, url = 'page') {
    if (!total_pages || total_pages == 0) {
        return '';
    }
    var html = '';

    var pageno = currentPage;
    var pagesToShow = 5;// total pages should appear
    var pageFrom = (pageno - Math.floor(pagesToShow / 2));
    var pageTo = (pageno + Math.floor(pagesToShow / 2));


    /*
     * pages to show after prev btn and before next btn
     */

    if (pageFrom < 1) {
        pageTo += Math.abs(pageFrom) + 1;
        pageFrom = 1;
    }
    if (pageTo > total_pages) {
        pageFrom -= pageTo - total_pages;
        pageTo = total_pages;
    }

    if (pageFrom < 1) pageFrom = 1;
    if (pageTo > total_pages) pageTo = total_pages;;

    // if current page greater than total pages 
    if (pageTo < pageno) pageno = pageTo;
    /*
     * print paging
     */

    html += `<ul class="pagination">`;
    html += `    <li><a href="javascript:" onclick="${url}(1)">First</a></li>`;
    html += `    <li class="${pageno <= 1 ? 'disabled' : ''}">`;
    html += `        <a href="javascript:" onclick="${pageno <= 1 ? '' : url}(1)">Previous</a>`;
    html += `    </li>`;


    for (var i = pageFrom; i <= pageTo; i++) {
        var currentClass = '';
        if (pageno == i) {
            currentClass = 'active';
        }
        html += `    <li class="${currentClass}"><a href="javascript:" onclick="${url}(${i})">${i}</a></li>`;
    }

    html += `    <li class="${pageno >= total_pages ? 'disabled' : ''}">`;
    html += `        <a href="javascript:" onclick="${pageno >= total_pages ? '' : url + `(${pageno + 1})`}">Next</a>`;
    html += `    </li>`;
    html += `    <li><a href="javascript:" onclick="${url}(${total_pages})">Last</a></li>`;
    html += `</ul>`;

    return html;

}

function update_city_list(obj, parent) {
    var countruCities = Cities.filter(ele => ele.country == obj.value)
    document.getElementById(parent).querySelector('#city').innerHTML = `<option value="0">City${countruCities.map(ele => (`<option value="${ele.id}">${ele.name}`)).join('')}`
}


function draw_sectors_checkboxes() {
    document.getElementById('section-list').innerHTML = `${Sectors.map(ele => (
        `
    <li>
        <input class="filter" type="checkbox" value="${ele.id}" id="section${ele.id}" onchange="filter_jobs();">
        <label class="checkbox-label" for="section${ele.id}">${ele.name}</label>
    </li>`
    )).join('')}`
}

function draw_countries_checkboxes() {
    document.getElementById('country-list').innerHTML = `${Countries.map(ele => (
        `
    <li>
        <input class="filter" type="checkbox" value="${ele.id}" id="country${ele.id}" onchange="draw_cities_checkboxes();filter_jobs();">
        <label class="checkbox-label" for="country${ele.id}">${ele.name}</label>
    </li>`
    )).join('')}`
}

function draw_cities_checkboxes() {
    var checked_ids = [];
    checked = document.getElementById('country-list').querySelectorAll('input[type=checkbox]:checked').forEach(ele => { checked_ids.push(ele.value) })
    var countruCities = Cities.filter(ele => checked_ids.includes(ele.country + ''))
    console.log(checked_ids);
    document.getElementById('city-list').innerHTML = `${countruCities.map(ele => (
        `
    <li>
        <input class="filter" type="checkbox" value="${ele.id}" id="city${ele.id}" onchange="filter_jobs();">
        <label class="checkbox-label" for="city${ele.id}">${ele.name}</label>
    </li>`
    )).join('')}`
}


function submit_job() {
    modalObj = jobModal.getBodyObject();
    var isValid = job_form_validation(modalObj);
    if (!isValid) {
        return;
    }
    apiRequest({
        url: 'http://localhost:3500/jobs/postJob',
        method: 'POST',
        data: {
            sector: modalObj.querySelector('#sector').value,
            country: modalObj.querySelector('#country').value,
            city: modalObj.querySelector('#city').value,
            title: modalObj.querySelector('#title').value,
            desc: modalObj.querySelector('#description').value,
        },
        onSuccess: (responseObj) => {
            filter_jobs();
            toggle_custom_modal('add-job-modal');
            empty_modal_form();
            //console.log(responseObj);
        }
    });
}

function filter_jobs(page) {
    if (!page) page = 1;
    var countries = [], cities = [], sectors = [];
    var title = document.getElementById('title-filter').value;
    document.getElementById('country-list').querySelectorAll('input[type=checkbox]:checked').forEach(ele => { countries.push(ele.value) });
    document.getElementById('city-list').querySelectorAll('input[type=checkbox]:checked').forEach(ele => { cities.push(ele.value) });
    document.getElementById('section-list').querySelectorAll('input[type=checkbox]:checked').forEach(ele => { sectors.push(ele.value) });


    apiRequest({
        url: 'http://localhost:3500/jobs/getJobs',
        method: 'GET',
        data: {
            sector: JSON.stringify(sectors),
            country: JSON.stringify(countries),
            city: JSON.stringify(cities),
            title: title,
            page: page
        },
        onSuccess: (responseObj) => {
            var data = JSON.parse(responseObj.response);
            if (data.data && data.data.length > 0) {
                print_job(data, page);
            }
            else {
                document.getElementsByClassName('cards')[0].innerHTML = '<center class="no-records">No jobs posted</center>';
                document.getElementsByClassName('pages')[0].innerHTML = '';
            }
        }
    });

}


function delete_job() {
    apiRequest({
        url: 'http://localhost:3500/jobs/deleteJob/' + jobIdToDelete,
        method: 'DELETE',
        onSuccess: (responseObj) => {
            toggle_custom_modal('delete-job-modal');
            filter_jobs();
            //document.getElementsByClassName('cards')[0].innerHTML = '<center class="no-records">No jobs posted</center>';

        }
    });
}

function get_job(id) {
    apiRequest({
        url: 'http://localhost:3500/jobs/getJob/' + id,
        method: 'GET',
        onSuccess: (responseObj) => {
            var data = JSON.parse(responseObj.response);
            if (data) {
                fill_update_modal(data)
            }
        }
    });
}

function edit_job() {
    modalObj = editJobModal.getBodyObject();
    var isValid = job_form_validation(modalObj);
    if (!isValid) {
        return;
    }
    apiRequest({
        url: 'http://localhost:3500/jobs/updateJob/' + jobIdToupdate,
        method: 'PUT',
        data: {
            sector: modalObj.querySelector('#sector').value,
            country: modalObj.querySelector('#country').value,
            city: modalObj.querySelector('#city').value,
            title: modalObj.querySelector('#title').value,
            desc: modalObj.querySelector('#description').value,
        },
        onSuccess: (responseObj) => {
            toggle_custom_modal('edit-job-modal');
            filter_jobs();
            //console.log(responseObj);
        }
    });
}




function print_job(data, page) {
    var html = data.data.map(ele => {
        return (
            `<div class="job-card">
          <div class="job-card-media">
            <img src="img/job.jpg" alt="img">
          </div>
          <div class="job-card-desc">
            <div class="job-card-title">
              <h2 class="job-card-title-text">${ele.title}</h2>
            </div>
            <div class="job-card-city">
              <h2 class="job-card-city-text">${Cities.find(item => ele.city == item.id).name}, ${Countries.find(item => ele.country == item.id).name}</h2>
            </div>
            <div class="job-card-city">
              <h2 class="job-card-city-text">${Sectors.find(item => ele.sector == item.id).name}</h2>
            </div>
            <div class="job-card-supporting-text">
            ${ele.desc.length > 120 ? ele.desc.slice(0, 120) + '...' : ele.desc.slice(0, 120)}
            </div>

            <div class="job-card-menu">
              <button class="job-button-icon" onclick="jobIdToupdate='${ele._id}';get_job('${ele._id}');toggle_custom_modal('edit-job-modal')"><img src="img/view.svg"></i></button>
              <button class="job-button-icon" onclick="jobIdToDelete='${ele._id}';toggle_custom_modal('delete-job-modal')"><img src="img/delete.svg"></i></button>
            </div>
          </div>
        </div>`)
    }).join('');

    var pages = paging(page, data.total_pages, 'filter_jobs');
    document.getElementsByClassName('pages')[0].innerHTML = pages;
    document.getElementsByClassName('cards')[0].innerHTML = html;
}


function fill_update_modal(data) {
    modalObj = editJobModal.getBodyObject();
    modalObj.querySelector('#title').value = data.title;
    modalObj.querySelector('#description').value = data.desc;
    modalObj.querySelector('#country').value = data.country;
    modalObj.querySelector('#country').onchange()
    modalObj.querySelector('#city').value = data.city;
    modalObj.querySelector('#sector').value = data.sector;
}


function empty_modal_form() {
    modalObj = jobModal.getBodyObject();
    modalObj.querySelector('#title').value = '';
    modalObj.querySelector('#description').value = '';
    modalObj.querySelector('#country').value = 0;
    modalObj.querySelector('#country').onchange()
    modalObj.querySelector('#city').value = 0;
    modalObj.querySelector('#sector').value = 0;
}


function job_form_validation(parentObj) {
    var title = parentObj.querySelector('#title');
    var sector = parentObj.querySelector('#sector');
    var country = parentObj.querySelector('#country');
    var city = parentObj.querySelector('#city');
    var desc = parentObj.querySelector('#description');
    var isInvalid = true;
    if (!title.value || title.value == '') {
        title.classList.add('invalid-input');
        parentObj.querySelector('#title-invalid').innerHTML = 'Job title required'
        isInvalid = false;
    }
    else {
        title.classList.remove('invalid-input');
        parentObj.querySelector('#title-invalid').innerHTML = '';
    }

    if (!sector.value || sector.value == 0) {
        sector.classList.add('invalid-input');
        parentObj.querySelector('#sector-invalid').innerHTML = 'Job sector required'
        isInvalid = false;
    }
    else {
        sector.classList.remove('invalid-input');
        parentObj.querySelector('#sector-invalid').innerHTML = '';
    }

    if (!country.value || country.value == 0) {
        country.classList.add('invalid-input');
        parentObj.querySelector('#country-invalid').innerHTML = 'Job country required'
        isInvalid = false;
    }
    else {
        country.classList.remove('invalid-input');
        parentObj.querySelector('#country-invalid').innerHTML = '';
    }

    if (!city.value || city.value == 0) {
        city.classList.add('invalid-input');
        parentObj.querySelector('#city-invalid').innerHTML = 'Job city required'
        isInvalid = false;
    }
    else {
        city.classList.remove('invalid-input');
        parentObj.querySelector('#city-invalid').innerHTML = '';
    }

    if (!desc.value || desc.value == '') {
        desc.classList.add('invalid-input');
        parentObj.querySelector('#description-invalid').innerHTML = 'Job description required'
        isInvalid = false;
    }
    else {
        desc.classList.remove('invalid-input');
        parentObj.querySelector('#description-invalid').innerHTML = '';
    }


    return isInvalid;
}

