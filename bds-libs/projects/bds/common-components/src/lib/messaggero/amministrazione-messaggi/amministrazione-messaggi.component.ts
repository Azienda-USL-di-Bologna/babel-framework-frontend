import { Component, OnInit } from "@angular/core";
import { FiltersAndSorts, FilterDefinition, FILTER_TYPES, SortDefinition, SORT_MODES, PagingConf, AdditionalDataDefinition } from "@nfa/next-sdr";
import { ENTITIES_STRUCTURE, TemplateMessaggio, AmministrazioneMessaggio, TipologiaEnum, InvasivitaEnum, SeveritaEnum, Applicazione, Persona, Azienda, Struttura, TemplateMessaggiService, ApplicazioneService, AziendaService, StrutturaService, PersonaService, AmministrazioneMessaggiService } from "@bds/ng-internauta-model";
import { SelectItem, ConfirmationService, FilterMetadata, LazyLoadEvent, MessageService } from "primeng/api";
import { buildLazyEventFiltersAndSorts } from "@bds/primeng-plugin";
import { DatePipe } from "@angular/common";
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from "@angular/forms";

@Component({
  selector: "prp-amministrazione-messaggi",
  templateUrl: "./amministrazione-messaggi.component.html",
  styleUrls: ["./amministrazione-messaggi.component.scss"],
  providers: [ConfirmationService]
})

export class AmministrazioneMessaggiComponent implements OnInit {

  private Severita = {
    INFO: "Informazione",
    WARNING: "Attenzione",
    ERROR: "Problema"
  }

  private Invasivita = {
    LOGIN: "Login",
    POPUP: "PopUp"
  };
  
  private Tipologia = {
    RIPRESENTA_CON_INTERVALLO: "Ripresenta con intervallo",
    MOSTRA_UNA_SOLA_VOLTA: "Mostra una sola volta",
    CONSENTI_SCELTA: "Consenti scelta"
  };

  private pageConfNoLimit: PagingConf = {
    conf: {
      page: 0,
      size: 999999
    },
    mode: "PAGE"
  };

  private pageConfTable: PagingConf = {
    mode: "LIMIT_OFFSET",
    conf: {
      limit: 0,
      offset: 0
    }
  };
  private previousFilter: FilterDefinition[] = [];
  public _filters: FilterDefinition[];
  public rowsNumber = 7;
  public rowsNumberStorico = 17;

  public templates: SelectItem[];
  public selectedTemplate: TemplateMessaggio;
  public applications: Applicazione[];
  public selectedApplications: Applicazione[];
  public aziende: Azienda[];
  public selectedAziende: Azienda[];
  public strutture: Struttura[];
  public selectedStrutture: Struttura[];
  public persone: Persona[];
  public selectedPersone: Persona[];
  public tipologie: SelectItem[] = [];
  public invasivita: SelectItem[] = [];
  public severita: SelectItem[] = [];

  public sendAll = false;
  public display = false;
  public displayTableDialog = false;
  public minDate: Date;
  public nomeTemplate: string;

  public notification: AmministrazioneMessaggio;
  public selectedMessaggioAttivo: AmministrazioneMessaggio;
  public selectedMessaggioStorico: AmministrazioneMessaggio;
  public amministrazioneMessaggiAttivi: AmministrazioneMessaggio[];
  public amministrazioneMessaggiStorico: AmministrazioneMessaggio[];
  public notificationForm: FormGroup;

  public loading = false;
  public loadingStorico = false;
  public totalRecords: number;
  public totalRecordsStorico: number;
  public cols: any[] = [
    { field: "testo", header: "Testo" },
    { field: "dataPubblicazione", header: "Data pubblicazione"},
    { field: "dataScadenza", header: "Data scadenza"},
    { field: "", header: "", width: "8em"},
  ];

  constructor(
    private messageService: MessageService,
    private templateMessaggiService: TemplateMessaggiService,
    private applicazioniService: ApplicazioneService,
    private aziendaService: AziendaService,
    private strutturaService: StrutturaService,
    private personaService: PersonaService,
    private amministrazioneMessaggiService: AmministrazioneMessaggiService,
    private confirmationService: ConfirmationService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.minDate = new Date();
    Object.keys(TipologiaEnum).forEach(key => {
      this.tipologie.push({ label: this.Tipologia[key], value: key });
    });
    Object.keys(InvasivitaEnum).forEach(key => {
      this.invasivita.push({ label: this.Invasivita[key], value: key });
    });
    Object.keys(SeveritaEnum).forEach(key => {
      this.severita.push({ label: this.Severita[key], value: key });
    });

    this.loadTemplates();
    this.loadApplications();
    this.loadAziende();
    this.loadDataAttivi(null);
    this.loadDataStorico(null);
    this.initNotificationForm();
  }

  /**
   * Inizializzazione della form con tutti campi vuoti e i validatori
   */
  private initNotificationForm() {
    this.notificationForm = new FormGroup({
      titolo: new FormControl("", Validators.required),
      testo: new FormControl("", Validators.required),
      tipologia: new FormControl("", Validators.required),
      severita: new FormControl("", Validators.required),
      invasivita: new FormControl("", Validators.required),
      dataPubblicazione: new FormControl(new Date()),
      dataScadenza: new FormControl(""),
      intervallo: new FormControl(0, Validators.max(100)),
      idApplicazioni: new FormControl([]),
      targets: new FormGroup(        {
        perTutti: new FormControl(false),
        idAziende: new FormControl([]),
        idStrutture: new FormControl([]),
        idPersone: new FormControl([])
      }, {validators: this.atLeastOne(Validators.required) })
    });
  }

  /**
   * Il metodo compila ricorsivamente un FormGroup in base al dato sorgente,
   * entrambi sono passati come parametri.
   * @param group Il form group da compilare
   * @param source L'oggetto sorgente da cui prendere i valori per compilare il form
   */
  private changeFormValues(group: FormGroup, source?: any) {
    let keyTemplate: any;
    Object.keys(group.controls).forEach(key => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.changeFormValues(abstractControl, source);
      } else {
        if (source.hasOwnProperty(key)) {
          keyTemplate = source[key];
          if (keyTemplate && keyTemplate.length > 0) {
            switch (key) {
              case "idApplicazioni":
                group.controls[key].setValue(this.applications.filter(app => keyTemplate.indexOf(app.id) !== -1));
                break;
              case "idAziende":
                group.controls[key].setValue(this.aziende.filter(az => keyTemplate.indexOf(az.id) !== -1));
                break;
              case "idStrutture":
                this.loadStrutture(keyTemplate, group);
                break;
              case "idPersone":
                this.loadPersone(keyTemplate, group);
                break;
              default:
                group.controls[key].setValue(source[key]);
                break;
            }
          } else {
            group.controls[key].setValue(source[key]);
          }
        }
      }
    });
    group.markAsPristine();
  }

  private loadStrutture(idStrutture: number[], group: FormGroup) {
    const projection = ENTITIES_STRUCTURE.baborg.struttura.standardProjections.StrutturaWithIdAzienda;
    this.strutturaService.getData(projection, null, this.buildStruttureFilterForLoad(idStrutture), null).subscribe(
      data => {
        if (data && data.results) {
          data.results.forEach((element: Struttura) => {
            element["nomeCustom"] = element.nome + " (" + element.idAzienda.nome + ")";
          });
          group.get("idStrutture").setValue(data.results);
        }
      },
      (err) => {
        console.log("Error: ", err);
        // this.messageService.add({ severity: "error", summary: "Errore", detail: "Qualcosa è andato storto.\nContattattare Babelcare" });
      }
    );
  }

  private loadPersone(idPersone: number[], group: FormGroup) {
    // const projection = ENTITIES_STRUCTURE.baborg.persone.standardProjections.UtenteWithIdAziendaAndIdPersona;
    this.personaService.getData(null, null, this.buildPersoneFilterForLoad(idPersone), null).subscribe(
      data => {
        if (data && data.results) {
          data.results.forEach((p: Persona) => {
            p["descrizioneCustom"] = p.descrizione + " (" + p.codiceFiscale + ")";
          });
          group.get("idPersone").setValue(data.results);
        }
      },
      (err) => {
        console.log("Error: ", err);
      }
    );
  }

  private buildStruttureFiltersAndSorts(stringToSearch: string): FiltersAndSorts {
    const filtersAndSorts = new FiltersAndSorts();
    filtersAndSorts.addFilter(new FilterDefinition("nome", FILTER_TYPES.string.containsIgnoreCase, stringToSearch));
    filtersAndSorts.addFilter(new FilterDefinition("attiva", FILTER_TYPES.not_string.equals, true));
    filtersAndSorts.addSort(new SortDefinition("nome", SORT_MODES.asc));
    return filtersAndSorts;
  }

  private buildStruttureFilterForLoad(idStrutture: number[]): FiltersAndSorts {
    const filtersAndSorts = new FiltersAndSorts();
    for (let i = 0; i < idStrutture.length; i++) {
      filtersAndSorts.addFilter(new FilterDefinition("id", FILTER_TYPES.not_string.equals, idStrutture[i]));
    }
    filtersAndSorts.addFilter(new FilterDefinition("attiva", FILTER_TYPES.not_string.equals, true));
    filtersAndSorts.addSort(new SortDefinition("nome", SORT_MODES.asc));
    return filtersAndSorts;
  }

  private buildPersoneFiltersAndSorts(stringToSearch: string): FiltersAndSorts {
    const filtersAndSorts = new FiltersAndSorts();
    if (stringToSearch) {
      filtersAndSorts.addFilter(new FilterDefinition("descrizione", FILTER_TYPES.string.startsWithIgnoreCase, stringToSearch));
      filtersAndSorts.addFilter(new FilterDefinition("utenteList.attivo", FILTER_TYPES.not_string.equals, true));
      filtersAndSorts.addSort(new SortDefinition("descrizione", SORT_MODES.asc));
    }
    return filtersAndSorts;
  }

  private buildPersoneFilterForLoad(idPersone: number[]): FiltersAndSorts {
    const filtersAndSorts = new FiltersAndSorts();
    for (let i = 0; i < idPersone.length; i++) {
      filtersAndSorts.addFilter(new FilterDefinition("id", FILTER_TYPES.not_string.equals, idPersone[i]));
    }
    filtersAndSorts.addFilter(new FilterDefinition("utenteList.attivo", FILTER_TYPES.not_string.equals, true));
    filtersAndSorts.addSort(new SortDefinition("descrizione", SORT_MODES.asc));
    return filtersAndSorts;
  }

  private loadDataAttivi(pageCong: PagingConf, lazyFilterAndSort?: FiltersAndSorts) {
    this.loading = true;
    const initialFilterAndSort = new FiltersAndSorts();
    initialFilterAndSort.addSort(new SortDefinition("dataPubblicazione", SORT_MODES.asc));
    initialFilterAndSort.addAdditionalData(new AdditionalDataDefinition("OperationRequested", "GetAmministrazioneMessaggiAttivi"));
     const projection = ENTITIES_STRUCTURE.messaggero.templatemessaggio.standardProjections.AmministrazioneMessaggioWithPlainFields;
      this.amministrazioneMessaggiService.getData(projection, initialFilterAndSort, lazyFilterAndSort, pageCong).subscribe(data => {
        if (data && data.results) {
          this.totalRecords = data.page.totalElements;
          this.amministrazioneMessaggiAttivi = data.results;
        }
        this.loading = false;
      });
  }
  private loadDataStorico(pageCong: PagingConf, lazyFilterAndSort?: FiltersAndSorts) {
    this.loadingStorico = true;
    const initialFilterAndSort = new FiltersAndSorts();
    initialFilterAndSort.addSort(new SortDefinition("dataScadenza", SORT_MODES.desc));
    initialFilterAndSort.addAdditionalData(new AdditionalDataDefinition("OperationRequested", "GetAmministrazioneMessaggiStorico"));
    const projection = ENTITIES_STRUCTURE.messaggero.templatemessaggio.standardProjections.AmministrazioneMessaggioWithPlainFields;
      this.amministrazioneMessaggiService.getData(projection, initialFilterAndSort, lazyFilterAndSort, pageCong).subscribe(data => {
        if (data && data.results) {
          console.log("DATA = ", data);
          this.totalRecordsStorico = data.page.totalElements;
          this.amministrazioneMessaggiStorico = data.results;
        }
        this.loadingStorico = false;
      });
  }

  private needLoading(event: LazyLoadEvent): boolean {
    let needLoading = this.pageConfTable.conf.limit !== event.rows ||
    this.pageConfTable.conf.offset !== event.first;
    if (!needLoading) {
      if (this._filters && !this.previousFilter || !this._filters && this.previousFilter) {
        needLoading = true;
      } else if (this._filters && this.previousFilter) {
        for (const filter of this._filters) {
          if (this.previousFilter.findIndex(e =>
            e.field === filter.field && e.filterMatchMode === filter.filterMatchMode && e.value === filter.value) === -1) {
              needLoading = true;
              break;
          }
        }
      }
    }
    return needLoading;
  }

  nuovoMessaggio() {
    this.nomeTemplate = "";
    this.selectedTemplate = null;
    this.clearSelectedMessages();
    this.initNotificationForm();
    setTimeout(() => {
      this.notificationForm.enable();
    });
  }

  clearSelectedMessages() {
    this.selectedMessaggioAttivo = null;
    this.selectedMessaggioStorico = null;
  }

  modificaMessaggio() {
    this.nomeTemplate = "";
    this.selectedTemplate = null;
    this.notificationForm.enable();
    this.disableTargetsGroup();
  }

  annullaModifiche() {
    this.changeFormValues(this.notificationForm, this.selectedMessaggioAttivo);
    this.notificationForm.disable();
  }

  eliminaTemplate() {
    this.templateMessaggiService.deleteHttpCall(this.selectedTemplate.id).subscribe(
      res => {
        this.templates.splice(this.templates.findIndex(t => t.value === this.selectedTemplate), 1);
        this.nuovoMessaggio();
        this.messageService.add({ severity: "success", summary: "Successo", detail: "Il template è stato eliminato con successo."});
      },
      err => {
        this.messageService.add({ severity: "error", summary: "Errore", detail: "Errore durante l'eliminazione del template." });
      }
    );
  }

  loadTemplates() {
    if (!this.templates || !this.templates.length) {
      this.templates = [];
      const projection = ENTITIES_STRUCTURE.messaggero.templatemessaggio.standardProjections.TemplateMessaggioWithPlainFields;
      const filtersAndSorts: FiltersAndSorts = new FiltersAndSorts();
      filtersAndSorts.addSort(new SortDefinition("nomeTemplate", SORT_MODES.asc));
      this.templateMessaggiService.getData(projection, filtersAndSorts, null, this.pageConfNoLimit).subscribe(data => {
        if (data && data.results && data.results.length > 0) {
          /* Sembra ci sia un bug nella dropdown di primeng per cui se l'array che contiene i dati della dropdown
           * non è del tipo SelectItem, cambiando un elemento di un array in seguito ad un update l'elemento selezionato
           * non vede il valore aggiornato ma il vecchio */
          data.results.forEach((el: TemplateMessaggio) => {
            this.templates.push({ label: el.nomeTemplate, value: el });
          });
        }
      });
    }
  }

  loadApplications() {
    const projection = ENTITIES_STRUCTURE.configurazione.applicazione.standardProjections.ApplicazioneWithPlainFields;
    if (!this.applications || !this.applications.length) {
      const filtersAndSorts: FiltersAndSorts = new FiltersAndSorts();
      filtersAndSorts.addSort(new SortDefinition("nome", SORT_MODES.asc));
      this.applicazioniService.getData(projection, filtersAndSorts, null, null).subscribe(data => {
        if (data && data.results) {
          this.applications = data.results;
        }
      });
    }
  }

  loadAziende() {
    const projection = ENTITIES_STRUCTURE.baborg.azienda.customProjections.CustomAziendaDescriptionFields;
    if (!this.aziende || !this.aziende.length) {
      const filtersAndSorts: FiltersAndSorts = new FiltersAndSorts();
      filtersAndSorts.addSort(new SortDefinition("descrizione", SORT_MODES.asc));
      this.aziendaService.getData(projection, filtersAndSorts, null, null).subscribe(data => {
        if (data && data.results) {
          this.aziende = data.results;
        }
      });
    }
  }

  /**
   * Validatore per i campi TARGETS, se almeno uno del form group è presente passa la validazione
    */
  atLeastOne = (validator: ValidatorFn) => (group: FormGroup): ValidationErrors | null => {
    const hasAtLeastOne = group && group.controls &&
      Object.keys(group.controls).some(
        k => {
          if (k === "perTutti") {
            return !validator(group.controls[k]) && group.controls[k].value;
          } else {
            return !validator(group.controls[k]);
          }
        });
    return hasAtLeastOne ? null : { atLeastOne: true };
  }

  getNomeAziende(idAziende) {
    let aziende = "";
    for (let index = 0; index < idAziende.length; index++) {
      const element = idAziende[index];
      aziende += this.aziende.find(az => az.id === element).nome + ", ";
    }
    return aziende.substring(0, aziende.length - 2);
  }

  lazyLoad(event: any, table: string) {
    const eventFilters: {[s: string]: FilterMetadata} = this.buildTableEventFilters(this._filters);
    if (event) {
      if (eventFilters && Object.entries(eventFilters).length > 0) {
        event.filters = eventFilters;
      }
      // questo if è il modo più sicuro per fare "event.first === Nan"
      if (event.first !== event.first) {
        event.first = 0;
      }
      if (this.needLoading(event)) {
        this.pageConfTable.conf = {
          limit: event.rows,
          offset: event.first
        };
        const filtersAndSorts: FiltersAndSorts = buildLazyEventFiltersAndSorts(
          event,
          this.cols,
          this.datepipe
        );
        if (table === "attivi") {
          this.loadDataAttivi(this.pageConfTable, filtersAndSorts);
        } else {
          this.loadDataStorico(this.pageConfTable, filtersAndSorts);
        }
      }
    } else {
      if (eventFilters) {
        event = {
          filters: eventFilters
        };
      }
      this.pageConfTable.conf = {
        limit: table === "attivi" ? this.rowsNumber * 2 : this.rowsNumberStorico * 2,
        offset: 0
      };
      const filtersAndSorts: FiltersAndSorts = buildLazyEventFiltersAndSorts(
        event,
        this.cols,
        this.datepipe
      );

      if (table === "attivi") {
        this.loadDataAttivi(this.pageConfTable, filtersAndSorts);
      } else {
        this.loadDataStorico(this.pageConfTable, filtersAndSorts);
      }
    }
    this.previousFilter = this._filters;
    // this.filtering = false;
  }

  buildTableEventFilters(filtersDefinition: FilterDefinition[] ): {[s: string]: FilterMetadata} {
    if (filtersDefinition && filtersDefinition.length > 0) {
      const eventFilters: {[s: string]: FilterMetadata} = {};
      filtersDefinition.forEach(filter => {
        const filterMetadata: FilterMetadata = {
          value: filter.value,
          matchMode: filter.filterMatchMode
        };
        eventFilters[filter.field] = filterMetadata;
      });
      return eventFilters;
    } else {
      return null;
    }
  }

  /**
   * Compila i campi dell'interfaccia quando viene scelto un template dal Dropdown
   * @param event L'evento del componente che contiene l'elemento selezionato
   */
  buildFromTemplate(event) {
    if (event.value) {
      this.nomeTemplate = this.selectedTemplate.nomeTemplate;
      this.changeFormValues(this.notificationForm, this.selectedTemplate);
      this.clearSelectedMessages();
      this.notificationForm.enable();
      this.disableTargetsGroup();
    } else {
      this.nuovoMessaggio();
    }
  }

  /**
   * Il metodo che effettua la ricerca delle strutture
   * @param event L'evento dell'autocomplete che contiene la stringa da cercare
   */
  filterStrutture(event: any) {
    if (event.query.length > 2) {
      const projection = ENTITIES_STRUCTURE.baborg.struttura.standardProjections.StrutturaWithIdAzienda;
      this.strutturaService.getData(projection, null, this.buildStruttureFiltersAndSorts(event.query), null).subscribe(
        data => {
          if (data && data.results) {
            data.results.forEach((element: Struttura) => {
              element["nomeCustom"] = element.nome + " (" + element.idAzienda.nome + ")";
            });
            this.strutture = data.results;
          }
        },
        (err) => {
          console.log("Error: ", err);
          // this.messageService.add({ severity: "error", summary: "Errore", detail: "Qualcosa è andato storto.\nContattattare Babelcare" });
        }
      );
    }
  }

  /**
   * Il metodo che effettua la ricerca degli utenti
   * @param event L'evento dell'autocomplete che contiene la stringa da cercare
   */
  filterPersone(event) {
    if (event.query.length > 2) {
      //const projection = ENTITIES_STRUCTURE.baborg.persona.standardProjections.UtenteWithIdAziendaAndIdPersona;
      this.personaService.getData(null, null, this.buildPersoneFiltersAndSorts(event.query), null).subscribe(
        data => {
          if (data && data.results) {
            data.results.forEach((p: Persona) => {
              p["descrizioneCustom"] = p.descrizione + " (" + p.codiceFiscale + ")";
            });
            this.persone = data.results;
          }
        },
        (err) => {
          console.log("Error: ", err);
          // this.messageService.add({ severity: "error", summary: "Errore", detail: "Qualcosa è andato storto.\nContattattare Babelcare" });
        });
    }
  }

  checkAndSave() {
    this.nomeTemplate = "";
    this.display = true;
  }

  /**
   * Costruisce il messaggio da salvare nella table Template dalla form.
   * Serve principalmente per mappare i dati degli Array Aziende, Strutture e Utenti
   * @param template Il Template da salvare
   * @param group Il Form
   */
  buildMessageToSave(template, group: FormGroup) {
    Object.keys(group.controls).forEach(key => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.buildMessageToSave(template, abstractControl);
      } else {
        const value = group.get(key).value;
        if (value && Array.isArray(value)) {
          template[key] = value.map(v => v["id"]);
        } else if (value !== null && value !== "") {
          template[key] = value;
        }
      }
    });
  }

  /**
   * Metodo per il salvataggio del template.
   */
  onSaveTemplate(operation: string) {
    const template = new TemplateMessaggio();
    this.buildMessageToSave(template, this.notificationForm);

    if (this.selectedTemplate && operation === "update") {
      template.id = this.selectedTemplate.id;
      template.version = this.selectedTemplate.version;
      this.templateMessaggiService.patchHttpCall(template, template.id).subscribe(
        (res: TemplateMessaggio) => {
          this.display = false;
          const item: SelectItem = { label: res.nomeTemplate, value: res };
          const i = this.templates.findIndex(t => t.value["id"] === res.id);
          this.templates[i] = item;
          this.messageService.add({ severity: "success", summary: "Successo", detail: "Il template è stato salvato con successo" });
          this.selectedTemplate = res;
          this.notificationForm.markAsPristine();
        },
        err => {
          this.messageService.add({severity: "error", summary: "Errore", detail: "Errore durante il salvataggio"});
        }
      );
    } else {
      template.nomeTemplate = this.nomeTemplate;
      template.severita = SeveritaEnum.INFO;
      this.templateMessaggiService.postHttpCall(template).subscribe(
        (res: TemplateMessaggio) => {
          this.display = false;
          const item: SelectItem = { label: res.nomeTemplate, value: res };
          this.templates.push(item);
          this.templates.sort((a, b) => a.value["nomeTemplate"] > b.value["nomeTemplate"] ? 1 : -1);
          this.selectedTemplate = res;
          this.clearSelectedMessages();
          if (this.notificationForm.disabled) {
            this.notificationForm.enable();
          }
          this.disableTargetsGroup();
          this.messageService.add({ severity: "success", summary: "Successo", detail: "Il template è stato salvato con successo" });
          this.notificationForm.markAsPristine();
        },
        err => {
          this.messageService.add({severity: "error", summary: "Errore", detail: "Errore durante il salvataggio"});
        }
      );
    }
  }

  confirmSaveTemplate() {
    this.confirmationService.confirm({
      message: "Vuoi sovrascrivere il template selezionato?",
      header: "Conferma",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.onSaveTemplate("update");
      },
      reject: () => { }
    });
  }

  confirmDeleteTemplate() {
    this.confirmationService.confirm({
      message: "Vuoi eliminare il template selezionato?",
      header: "Conferma",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.eliminaTemplate();
      },
      reject: () => { }
    });
  }

  checkAndSend() {
    let message = "";
    if (this.selectedMessaggioAttivo && this.notificationForm.enabled) {
      message = "Vuoi salvare le modifiche?";
    } else {
      message = "Vuoi inviare il messaggio agli utenti?";
    }
    this.confirmationService.confirm({
      message: message,
      header: "Conferma",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.showMessage();
      },
      reject: () => { }
    });
  }

  /**
   * Salva il messaggio che verrà mostrato agli utenti
   */
  showMessage() {
    const amministrazioneMessaggio = new AmministrazioneMessaggio();
    this.buildMessageToSave(amministrazioneMessaggio, this.notificationForm);
    // this.updateArrayFields();
    console.log("TEMPLATE = ", amministrazioneMessaggio);
    if (this.selectedMessaggioAttivo) {
      amministrazioneMessaggio.id = this.selectedMessaggioAttivo.id;
      amministrazioneMessaggio.version = this.selectedMessaggioAttivo.version;
      this.amministrazioneMessaggiService.patchHttpCall(amministrazioneMessaggio, amministrazioneMessaggio.id).subscribe(
        (res: AmministrazioneMessaggio) => {
          const index = this.amministrazioneMessaggiAttivi.findIndex(m => m.id === amministrazioneMessaggio.id);
          res.dataPubblicazione = new Date(res.dataPubblicazione);
          this.amministrazioneMessaggiAttivi[index] = res;
          this.notificationForm.disable();
          this.messageService.add({
            severity: "success", summary: "Successo",
            detail: "Il messaggio è stato modificato con successo."
          });
        },
        err => {
          this.messageService.add({severity: "error", summary: "Errore", detail: "Errore durante il salvataggio"});
        }
      );
    } else {
      amministrazioneMessaggio.severita = SeveritaEnum.INFO;
      this.amministrazioneMessaggiService.postHttpCall(amministrazioneMessaggio).subscribe(
        (res: AmministrazioneMessaggio) => {
          res.dataPubblicazione = new Date(res.dataPubblicazione);
          if (res.dataScadenza) {
            res.dataScadenza = new Date(res.dataScadenza);
          }
          this.amministrazioneMessaggiAttivi.push(res);
          this.amministrazioneMessaggiAttivi.sort((a, b) => a.dataPubblicazione > b.dataPubblicazione ? 1 : -1);
          this.notificationForm.disable();
          this.messageService.add({
            severity: "success", summary: "Successo",
            detail: "Il messaggio è stato salvato e verrà mostrato agli utenti all'orario stabilito."
          });
        },
        err => {
          this.messageService.add({severity: "error", summary: "Errore", detail: "Errore durante il salvataggio"});
        }
      );
    }
  }

  /**
   * Questo metodo allinea i valori degli array selezionati così come devono essere salvati sul DB
   * ovvero prende gli id degli elementi selezionati per ciascun array.
   */
  updateArrayFields() {
    if (this.selectedApplications) {
      this.notification.idApplicazioni = this.selectedApplications.map(app => app["id"]);
    }
    if (this.selectedAziende && this.selectedAziende.length > 0) {
      this.notification.idAziende = this.selectedAziende.map(az => az["id"]);
    } else if (this.selectedStrutture && this.selectedStrutture.length > 0) {
      this.notification.idStrutture = this.selectedStrutture.map(st => st["id"]);
    } else if (this.selectedPersone && this.selectedPersone.length > 0) {
      this.notification.idPersone = this.selectedPersone.map(ut => ut["id"]);
    }
  }

  onRowSelect(event, table: string) {
    this.selectedTemplate = null;
    this.nomeTemplate = "";
    switch (table) {
      case "attivi":
        this.changeFormValues(this.notificationForm, this.selectedMessaggioAttivo);
        this.selectedMessaggioStorico = null;
        break;
      case "storico":
        this.changeFormValues(this.notificationForm, this.selectedMessaggioStorico);
        this.selectedMessaggioAttivo = null;
        break;
    }
    this.notificationForm.disable();
  }

  onSlideEnd(newValue) {
    // console.log("EEEE = ", newValue);
    newValue = parseInt(newValue, 10);  // Parso l'intero perché nell'input field rimane lo 0 davanti
    this.notificationForm.get("intervallo").patchValue(newValue > 0 ? newValue : 0);
  }

  onTargetsChange(value, targetChange) {
    const targetGroup: FormGroup = this.notificationForm.controls["targets"] as FormGroup;
    const filteredTargets = Object.keys(targetGroup.controls).filter(key => key !== targetChange);

    if ((targetChange === "perTutti" && value) ||
      (targetGroup.get(targetChange).value && targetGroup.get(targetChange).value.length > 0)) {
      filteredTargets.forEach(t => targetGroup.get(t).disable());
    } else {
      filteredTargets.forEach(t => targetGroup.get(t).enable());
    }
  }

  disableTargetsGroup() {
    const targetGroup: FormGroup = this.notificationForm.controls["targets"] as FormGroup;
    Object.keys(targetGroup.controls).forEach(control => {
      const filteredTargets = Object.keys(targetGroup.controls).filter(key => key !== control);
      if ((control === "perTutti" && targetGroup.get(control).value) ||
        (targetGroup.get(control).value && targetGroup.get(control).value.length > 0)) {
        filteredTargets.forEach(t => targetGroup.get(t).disable());
      }
    });
  }

  onRowEditInit(rowData: any) {
    console.log("ROW DATA = ", rowData);
    this.selectedMessaggioAttivo = rowData;
    this.notification = rowData;
  }

  getHeaderDettaglio() {
    if (this.selectedMessaggioAttivo) {
      return "Messaggio Attivo";
    } else if (this.selectedMessaggioStorico) {
      return "Messaggio Storico";
    } else {
      return "Nuovo Messaggio";
    }
  }
  getTipologiaLabel(tip: string) {
    return TipologiaEnum[tip];
  }
}
