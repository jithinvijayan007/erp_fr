import { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
@Injectable()
export class TypeaheadService {
  username = localStorage.getItem('username');
  protocol = window.location.protocol
  // hostAddress= 'http://192.168.0.174:5000/'; // freddy
  hostname = window.location.hostname
  port = environment.production ? 6001 : 8000;
  hostAddress = `${this.protocol}//${this.hostname}:${this.port}/`;

  url: string;
  url_customer:string;
  url_company: string;
  url_airport: string;
  url_airline: string;
  url_station: string;
  url_country: string;
  url_timezone: string;
  url_package: string;
  url_branch: string;
  url_branch_transfer: string;
  url_staff: string;
  url_auto_model: string;
  url_auto_variants: string;
  url_zone: string;
  url_source: string;
  url_territory: string;
  url_brand: string;
  url_branch_user: string;
  url_country_branch:string;
  url_product:string;
  url_branch_staff:string;
  url_group:string;
  url_auditor_staff: string;
  url_auditor: string;
  url_branch_dept: string;
  url_dept: string;

  constructor(private http: Http) {
    this.url = this.hostAddress + 'enquiry/get_customer_list/';
    this.url_customer = this.hostAddress + 'enquiry/get_customer_list_report/';
    this.url_company = this.hostAddress + 'user/get_company_list/';
    this.url_airline = this.hostAddress + 'user/get_airline_list/';
    this.url_airport = this.hostAddress + 'enquiry/get_airport_list/';
    this.url_station = this.hostAddress + 'enquiry/get_station_list/';
    this.url_country = this.hostAddress + 'country/get_country_list/';
    this.url_timezone = this.hostAddress + 'timezones/getalltimezones/';
    this.url_package = this.hostAddress + 'kct_package/get_package_list/';
    // this.url_user = this.hostAddress + 'user/get_user/';
    this.url_branch = this.hostAddress + 'branch/branch_typeahead/';
    this.url_territory = this.hostAddress + 'branch/territory_typeahead/';
    this.url_staff = this.hostAddress + 'user/user_typeahed/';
    this.url_auto_model = this.hostAddress + 'auto_mobile/model_typehead/';
    this.url_auto_variants = this.hostAddress + 'auto_mobile/get_variant/';
    // this.url_zone = this.hostAddress + 'state/zone_typehead/';
    this.url_source = this.hostAddress + 'branch_cost/source_typeahead/';
    this.url_zone = this.hostAddress + 'territory/zone_typehead/';
    this.url_brand = this.hostAddress + 'user/getbrand/';
    this.url_branch_user = this.hostAddress + 'user/getbranchuser/';
    this.url_country_branch = this.hostAddress + 'user/get_branch/';
    this.url_branch_transfer = this.hostAddress + 'branch_transfer/branch_typeahead/';
    this.url_branch_staff = this.hostAddress + 'branch_transfer/staff_typeahead/';
    this.url_group = this.hostAddress + 'groups/group_typeahead/';
    this.url_auditor_staff=this.hostAddress + 'auditing/userTypeahead/';
    this.url_auditor=this.hostAddress + 'auditing/auditorTypeahead/';
    this.url_branch_dept = this.hostAddress + 'branch/branch_dept_typeahead/';
    this.url_dept = this.hostAddress + 'branch/department_typeahead/';

  }

  search_branch_user(term,company,type){
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
    });
    const data = { 'term': term,
                    'int_company':company,
                   'type':type};
    return this.http
        .post(this.url_country_branch, data, { headers: headers })
        .map(res => {
            return res.json();
        });
  }

  searchBrand(term,productId){
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
    });
    const data = { term: term,product_id: productId};
    return this.http
        .post(this.hostAddress + 'productivityreport/list_brand/', data, { headers: headers })
        .map(res => {
            return res.json();
        });
  }

  searchProduct(term){
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
        .post(this.hostAddress + 'productivityreport/product_api/', data, { headers: headers })
        .map(res => {
            return res.json();
        });
  }

  searchPromoter(term){
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
        .post(this.hostAddress + 'productivityreport/list_promoter/', data, { headers: headers })
        .map(res => {
            return res.json();
        });
  }

  searchItem(term){
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
        .post(this.hostAddress + 'productivityreport/list_item/', data, { headers: headers })
        .map(res => {
            return res.json();
        });
  }

  search_brand(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_brand, data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

  search_source(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_source, data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }


 get_automobile_variants(data){
  const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
  const headers = new Headers({
    'content-type': 'application/json',
    Authorization: jwttoken
  });

  return this.http
    .get(this.url_auto_variants + '?fk_model=' + data, {
      headers: headers
    })
    .map(res=> {
      return res.json();
  });
 }

  search_automobile_model(data) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    return this.http.post(this.url_auto_model, data, { headers: headers }).map(res => {
      return res.json();
    });

  }

  search_territory(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_territory, data, { headers: headers })
      .map(res => {
        return res.json();
      });

  }

  search_zone(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_zone, data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

  search_customer(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });

    const data = { term: term, username: localStorage.getItem('username') };
    // return this.http.post(this.url,data).map(res => {
    return this.http.post(this.url, data, { headers: headers }).map(res => {
      return res.json();
    });
  }

  search_customer_report(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });

    const data = { term: term, username: localStorage.getItem('username') };
    // return this.http.post(this.url,data).map(res => {
    return this.http.post(this.url_customer, data, { headers: headers }).map(res => {
      return res.json();
    });
  }

  search_company(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_company, data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

  search_airport(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_airport, data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

  search_country(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_country, data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

  search_timezone(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });

    // const data = {'term':term,'username': this.username}
    // return this.http.post(this.url,data).map(res => {
    const dctData = { term: term };
    return this.http
      .post(this.url_timezone, dctData, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

//   searchBranch(term) {
//     const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
//     const headers = new Headers({
//       'content-type': 'application/json',
//       Authorization: jwttoken
//     });
//     const data = { term: term };
//     return this.http
//       .post(this.url_branch, data, { headers: headers })
//       .map(res => {
//         return res.json();
//       });
// }

  search_station(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_station, data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

  search_package(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_package, data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

  search_airline(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
    return this.http
      .post(this.url_airline, data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

  searchBranch(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
      return this.http
      .post(this.url_branch, data, { headers: headers })
      .map(res => {
      return res.json();
      });
    }

    searchGroup(term,filterData) {
      const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
      const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
      });
      const data = { term: term, 'filter': filterData};
        return this.http
        .post(this.url_group, data, { headers: headers })
        .map(res => {
        return res.json();
        });
      }

    searchBranchTransfer(term) {
      const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
      const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
      });
      // const data = { term: term };
        return this.http
        .post(this.url_branch_transfer, term, { headers: headers })
        .map(res => {
        return res.json();
        });
      }

      searchBranchStaff(term) {
        const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
        const headers = new Headers({
          'content-type': 'application/json',
          Authorization: jwttoken
        });
        const data = { term: term };
          return this.http
          .post(this.url_branch_staff, data, { headers: headers })
          .map(res => {
          return res.json();
          });
        }

    searchStaff(term) {
      const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
      const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
      });
      const data = { term: term };
        return this.http
        .post(this.url_staff, data, { headers: headers })
        .map(res => {
        return res.json();
        });
      }
      searchAuditor(term) {
        const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
        const headers = new Headers({
          'content-type': 'application/json',
          Authorization: jwttoken
        });
        const data = { term: term };
          return this.http
          .post(this.url_auditor_staff, data, { headers: headers })
          .map(res => {
          return res.json();
          });
        }


      searchCategory(term) {
        const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
        const headers = new Headers({
            'content-type': 'application/json',
            Authorization: jwttoken
        });
        const data = { term: term };
        return this.http
            .post(this.hostAddress + 'inventory/api_category_typeahead/', data, { headers: headers })
            .map(res => {
                return res.json();
            });
    }

    searchSubcategory(term,category) {
        const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
        const headers = new Headers({
            'content-type': 'application/json',
            Authorization: jwttoken
        });
      const data = { term: term, category: category};
        return this.http
            .post(this.hostAddress + 'inventory/api_subcategory_typeahead/', data, { headers: headers })
            .map(res => {
                return res.json();
            });
    }

    searchItemGroup(term) {
      const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
      const headers = new Headers({
          'content-type': 'application/json',
          Authorization: jwttoken
      });
    const data = { term: term};
      return this.http
          .post(this.hostAddress + 'inventory/item_group_typeahead/', data, { headers: headers })
          .map(res => {
              return res.json();
          });
  }

    searchSubcategoryByCat(data) {
      const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
      const headers = new Headers({
          'content-type': 'application/json',
          Authorization: jwttoken
      });
      return this.http
          .post(this.hostAddress + 'inventory/api_subcategory_by_cat/', data, { headers: headers })
          .map(res => {
              return res.json();
          });
  }

  searchSolarBrand(data) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
    });
    return this.http
        .post(this.hostAddress + 'enquiry_solar/search_brand/', data, { headers: headers })
        .map(res => {
            return res.json();
        });
}

searchSolarItem(data) {
  const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
  const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
  });
  return this.http
      .post(this.hostAddress + 'enquiry_solar/search_item/', data, { headers: headers })
      .map(res => {
          return res.json();
      });
}

  searchItemBySub(data) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
    });
    return this.http
        .post(this.hostAddress + 'inventory/api_item_by_sub/', data, { headers: headers })
        .map(res => {
            return res.json();
        });
}

searchSupplier(data) {
  const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
  const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
  });
  return this.http
      .post(this.hostAddress + 'stock_app/api_supplier/', data, { headers: headers })
      .map(res => {
          return res.json();
      });
}


search_state(term) {
  const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
  const headers = new Headers({
    'content-type': 'application/json',
    Authorization: jwttoken
  });
  const data = { term: term };
  return this.http
    .post(this.hostAddress + 'territory_hierarchy/state_typeahead/', data, { headers: headers })
    .map(res => {
      return res.json();
    });
}

searchUser(term) {
  const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
  const headers = new Headers({
    'content-type': 'application/json',
    Authorization: jwttoken
  });
  const data = { term: term };
  return this.http
    .post(this.url_branch_user, data, { headers: headers })
    .map(res => {
      return res.json();
    });
}

searchAssignee(term,id) {
  const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
  const headers = new Headers({
    'content-type': 'application/json',
    Authorization: jwttoken
  });
  const data = { term: term, id: id };
  return this.http
    .post(this.hostAddress + 'user/getbranchassignee/', data, { headers: headers })
    .map(res => {
      return res.json();
    });
}
searchGift(term) {
  const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
  const headers = new Headers({
    'content-type': 'application/json',
    Authorization: jwttoken
  });
  const data = { term: term };
    return this.http
    .post(this.hostAddress + 'gifts/api_gift_typeahead/', data, { headers: headers })
    .map(res => {
    return res.json();
    });
  }
  searchLocation(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
      return this.http
      .post(this.hostAddress + 'customer/v0.1/locationTypeahed/', data, { headers: headers })
      .map(res => {
      return res.json();
      });
    }

    searchItemByProduct(data) {
      const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
      const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
      });
      return this.http
        .post(this.hostAddress + 'inventory/api_item_by_brand/', data, { headers: headers })
        .map(res => {
          return res.json();
        });
      }
    searchProducts(data) {
      const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
      const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
      });
      const datas = { 'term': data };
      return this.http
        .post(this.hostAddress + 'inventory/api_product/', datas, { headers: headers })
        .map(res => {
          return res.json();
        });
    }
    searchItemAll(term) {
      const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
      const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
      });
      const data = { term: term };
        return this.http
        .post(this.hostAddress + 'schema/item_typeahead/', data, { headers: headers })
        .map(res => {
        return res.json();
        });
      }
      searchProductByGDP(term){
        const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
        const headers = new Headers({
            'content-type': 'application/json',
            Authorization: jwttoken
        });
        const data = { term: term };
        return this.http
            .post(this.hostAddress + 'productivityreport/product_api_gdp/', data, { headers: headers })
            .map(res => {
                return res.json();
            });
      }
  itemByProduct(data) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    return this.http
      .post(this.hostAddress + 'invoice/item_typahead/', data, { headers: headers })
      .map(res => {
        return res.json();
      });
  }

  searchStaffByBranch(data){
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
    });
    return this.http
      .post(this.hostAddress + 'staff_rewards/staff_by_branch/', data, { headers: headers })
        .map(res => {
            return res.json();
        });
  }
  searchBranchDept(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const headers = new Headers({
      'content-type': 'application/json',
      Authorization: jwttoken
    });
    const data = { term: term };
      return this.http
      .post(this.url_branch_dept, data, { headers: headers })
      .map(res => {
      return res.json();
      });
    }
    getAuditor(term) {
      const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
      const headers = new Headers({
        'content-type': 'application/json',
        Authorization: jwttoken
      });
      const data = { term: term };
        return this.http
        .post(this.url_auditor, data, { headers: headers })
        .map(res => {
        return res.json();
        });
      }
      getDept(term) {
        const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
        const headers = new Headers({
          'content-type': 'application/json',
          Authorization: jwttoken
        });
        const data = { term: term };
          return this.http
          .post(this.url_dept, data, { headers: headers })
          .map(res => {
          return res.json();
          });
        }
        searchEmployee(term: string) {
          const token = localStorage.getItem('Tokeniser');
          const headers = new Headers({ 'Authorization': 'JWT ' + token, 'content-type': 'application/json' });
          const data = { term: term.trim() };
          return this.http
              .post(this.hostAddress + 'leave_report/emp_typeahead/', data, { headers: headers })
              .map(res => {
                  return res.json();
              });
      }
}
