class AppData {
  constructor (_data, _itemsAmount) {
    this.uniqueHosts = [];
    this.hosts = [];
    this.data = _data;
    this.itemsAmount = _itemsAmount;
    this.nextInit = 0;
    this.topAppsByHost = this.getTopAppsByHost();
  }

  getHostShortName (item) {
    const host = item.split('.');
    return host[1];
  }

  getHosts () {
    this.hosts = this.data.reduce((data, item) => {
      item.host.forEach((host) => {
        data.push({
          host,
          version: item.version,
          apDex: item.apdex,
          name: item.name,
          contributors: item.contributors
        })
      });

      return data;
    }, []);

    this.hosts.sort((a, b) => b.apDex - a.apDex);

    return this.hosts;
  }

  getUniqueHosts () {
    this.uniqueHosts = this.data.reduce((data, item) => {
      item.host.forEach((host) => {
        if (data.indexOf(host) === -1){
          data.push(host);
        }
      });

      return data;
    }, []);

    return this.uniqueHosts;
  }

  addAppToHost (app) {
    const hostList = this.topAppsByHost;
    const host = this.getHostShortName(app.host);
    let getIndexToAdd;

    hostList[host].apps.some((item, index) => {
      if (item.apDex < app.apDex) {
        getIndexToAdd = index;
        return true;
      }
    });

    if (getIndexToAdd) {
      hostList[host].apps.splice((getIndexToAdd-1), 0, app);
      hostList[host].apps.pop();
    }

    return hostList[host];
  }

  removeAppFromHost (hostSelected, index) {
    const hostList = this.topAppsByHost;
    const host = this.getHostShortName(hostSelected);
    let hostListToBeDeletion = [];

    if(index < this.itemsAmount) {
      hostListToBeDeletion = hostList[host].apps;
      hostListToBeDeletion.splice(index, 1);

      const nextLimit = this.itemsAmount + this.nextInit;
      const nextApp = this.getTopAppsByHost(hostSelected, (1 + nextLimit), (this.itemsAmount + this.nextInit)).apps[0];
      hostListToBeDeletion.push(nextApp);
      hostList[host].apps = hostListToBeDeletion;
      this.nextInit++;
    }

    return hostList[host];
  }

  getTopAppsByHost (hostSelected, limit, init) {
    const topAppsByHost = {};

    this.getUniqueHosts().forEach(item => {
      topAppsByHost[this.getHostShortName(item)] = {
        hostName: item,
        apps: this.getHosts().filter(host => host.host === item).slice(init || 0, limit || this.itemsAmount)
      }
    });

    return hostSelected ? topAppsByHost[this.getHostShortName(hostSelected)] : topAppsByHost;

  }
}

export default AppData;