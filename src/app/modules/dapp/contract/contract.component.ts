import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContractUploaderService } from 'src/app/services/contract-uploader/contract-uploader.service';
import camelCase from 'camelcase';
import { ContractModel } from 'src/app/models/contract.model';
import { DecimalPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { TransactionsComponent } from '../transactions/transactions.component';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  providers: [MessageService]
})
export class ContractComponent implements OnInit {
  @ViewChild(TransactionsComponent) transactionsComponent: any;

  constructor(
    private contractUploaderService: ContractUploaderService,
    public decimalPipe: DecimalPipe,
    private messageService: MessageService
  ) { }

  showUploadDialog: boolean = false;
  contract: ContractModel = new ContractModel();
  constructors: any = [];

  isProcessing: boolean = false;
  showProcessDialog: boolean = false;

  uploadProcessMessage: string = "";
  isUploadProcessed: boolean = false;
  isUploadError: boolean = false;
  uploadSubscription: Subscription = new Subscription;

  activeIndex: number = 0;

  onSelect(event: any): void {
    let files = event.currentFiles;
    let metadataFile: any = null;
    let wasmFile: any = null;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type == 'application/json') {
          metadataFile = files[i];
        }

        if (files[i].type == 'application/wasm') {
          wasmFile = files[i];
        }
      }
    }

    let metadataFileReader = new FileReader();
    metadataFileReader.onload = (e) => {
      let metadata: any = metadataFileReader.result;
      if (metadata != null) {

        let wasmFileReader = new FileReader();
        wasmFileReader.onload = (e) => {
          let wasm: any = wasmFileReader.result;
          if (wasm != null) {
            let objArgs: any = {};
            let metadataObjects = JSON.parse(metadata);

            if (metadataObjects != null) {
              let constructors = metadataObjects.V3.spec.constructors;
              if (constructors.length > 0) {
                let constructorArgs = constructors[0].args;
                if (constructorArgs.length > 0) {
                  for (let a = 0; a < constructorArgs.length; a++) {
                    objArgs[camelCase(constructorArgs[a].label)] = null;
                  }
                }
              }
            }

            let params: any = [];
            if (objArgs != null) {
              for (let property in objArgs) {
                let obj: any = {};
                obj[property] = null;
                params.push(obj);

                this.constructors.push({
                  label: property,
                  value: null
                });
              }
            }

            this.contract = {
              metadata: JSON.stringify(JSON.parse(metadata)),
              wasm: wasm,
              params: params
            };
          }
        }
        wasmFileReader.readAsBinaryString(wasmFile);
      }
    }
    metadataFileReader.readAsText(metadataFile);
  }

  onClear(): void {
    this.constructors = [];
    this.contract = new ContractModel();
  }

  uploadHandler(event: any): void {
    let valid = true;

    if (this.constructors.length > 0) {
      for (let i = 0; i < this.constructors.length; i++) {
        if (this.constructors[i].value == null) {
          valid = false;
          break;
        }
      }
    }

    if (valid == true) {
      if (this.contract) {
        if (this.constructors.length > 0) {
          for (let i = 0; i < this.constructors.length; i++) {
            this.contract.params[i][this.constructors[i].label] = this.constructors[i].value;
          }
        }

        this.showProcessDialog = true;

        this.isProcessing = true;
        this.uploadProcessMessage = "Processing..."
        this.isUploadProcessed = false;
        this.isUploadError = false;

        this.contractUploaderService.upload(this.contract);
        let uploadEventMessages = this.contractUploaderService.uploadEventMessages.asObservable();

        this.uploadSubscription = uploadEventMessages.subscribe(
          message => {
            if (message != null) {
              if (message.hasError == true) {
                this.isProcessing = false;
                this.uploadProcessMessage = message.message;
                this.isUploadProcessed = false;
                this.isUploadError = true;

                this.uploadSubscription.unsubscribe();
              } else {
                if (message.isFinalized != true) {
                  this.uploadProcessMessage = message.message;
                } else {
                  this.isProcessing = false;
                  this.uploadProcessMessage = "Upload Complete!"
                  this.isUploadProcessed = true;
                  this.isUploadError = false;

                  this.showUploadDialog = false;
                  this.transactionsComponent.getTransactions();

                  this.uploadSubscription.unsubscribe();
                }
              }
            } else {
              this.isProcessing = false;
              this.uploadProcessMessage = "Somethings went wrong";
              this.isUploadProcessed = false;
              this.isUploadError = true;

              this.uploadSubscription.unsubscribe();
            }
          }
        );
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Please do not leave empty fields on the required constructors.' });
    }
  }

  ngOnInit(): void {

  }
}
