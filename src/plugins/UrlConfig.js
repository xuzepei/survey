import { userShared } from './User.js';

class UrlConfig {

    baseUrlList = [
        { region: "cn", url: "https://cn.freqtek.com" },
        { region: "eu", url: "https://eu.freqtek.com" },
        { region: "in", url: "https://in.freqtek.com" },
        { region: "en", url: "https://en.freqtek.com" },
    ];

    getBaseUrl() {
        const region = userShared.getRegion();
        const default_base_url = this.baseUrlList[0].url;

        if (!region) {
            return "";
        }

        const match = this.baseUrlList.find(item => item.region === region);
        return match ? match.url : default_base_url;
    }

    async fetchAPIHostUrl(axiosInstance) {

        if (!userShared.getRegion()) {
            console.warn("No region selected, can not fetch API host URL.");
            return;
        }

        console.log("#### Fetch API host URL for region: " + userShared.getRegion());

        const urlString = this.getBaseUrl() + "/common/services";
        console.log("urlString: " + urlString);

        try {
            // 使用 this.$http 调用
            const response = await axiosInstance.get(urlString);

            console.log("#### API host response: ", response);

            if (response.status === 200) {

                const contentType = response.headers['content-type'];
                if (contentType && contentType.includes('application/json')) {

                    if (response.data.success === true && response.data.data != null) {
                        // 保存API host URL到localStorage
                        this.saveAPIHostUrlByRegion(response.data.data);
                        return;
                    } else {
                        console.log("errorCode: " + response.data.errorCode);
                        console.log("errorMessage: " + response.data.errorMessage);
                    }
                }

            }

            const msg = 'Get API host URL failed: ' + response.statusText;
            console.error(msg);

        } catch (e) {
            console.error(e);
        }
    }

    saveAPIHostUrlByRegion(dict) {
        const region = userShared.getRegion();
        if (!region) {
            return;
        }

        const key = `api_host_url_${region}`;
        localStorage.setItem(key, JSON.stringify(dict));
        //window.sessionStorage.setItem(key, JSON.stringify(dict));
    }

    getAPIHostUrlByRegion() {
        const region = userShared.getRegion();
        if (!region) {
            return null;
        }
        const key = `api_host_url_${region}`;
        //const data = window.sessionStorage.getItem(key);
        const data = localStorage.getItem(key);
        if (data) {
            const dict = JSON.parse(data);
            if (!dict) {
                console.warn(`Can not parse the data: ${data}`);
                return null;
            }

            return dict;
        }

        console.warn(`No API host URL found for region: ${region}`);
        return null;
    }

    getAPIHostByKey(key) {

        if (userShared.getRegion) {
            const dict = this.getAPIHostUrlByRegion();
            if (dict) {
                for (const temp of Object.keys(dict)) {
                    if (temp.toLowerCase() === key) {
                        return dict[temp];
                    }
                }
            }
        }

        return "";
    }

    userTokenUrl() {
        const key="dsdhost";
        const host = this.getAPIHostByKey(key);
        if (host) {
            return host + "/token";
        }

        return "";
    }

    refreshUserTokenUrl() {
        const key="corehost";
        const host = this.getAPIHostByKey(key);
        if (host) {
            return host + "/connect/token";
        }

        return "";
    }

}

export const urlConfigShared = new UrlConfig();